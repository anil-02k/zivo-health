import { toast } from "@/hooks/use-toast";

// Update with the provided API key
const API_KEY = "AIzaSyAVbiyHrdUXrqA5i7KpxDtCunySAf8NNEo";

export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  riskFactors: string[];
}

export async function analyzeLabReport(file: File): Promise<AnalysisResult> {
  try {
    console.log("Starting analysis for file:", file.name);
    console.log("File type:", file.type);
    console.log("File size:", file.size);

    // Prepare Gemini API request
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `
    You are a medical AI assistant analyzing a lab report.
    Analyze the attached file (image or PDF) thoroughly.
    Focus on medical values, ranges, and abnormalities.
    Provide clear, actionable insights.
    If information is limited, make reasonable assumptions based on standard lab report formats.

    Format your response as:

    SUMMARY: Brief overview of findings

    KEY_FINDINGS:
    - List important values and abnormalities

    RECOMMENDATIONS:
    - Actionable health advice

    RISK_FACTORS:
    - Potential health concerns
    `;

    const base64File = await fileToBase64(file);
    const base64Data = base64File.split(",")[1];

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: file.type,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generation_config: {
        temperature: 0.1,
        max_output_tokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to analyze lab report");
    }

    const data = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text || "";

    if (!aiText.trim()) {
      throw new Error("Empty response from AI");
    }

    return parseAIResponse(aiText);
  } catch (error) {
    console.error("Analysis error:", error);

    let errorMessage = "Failed to analyze lab report";
    if (error instanceof DOMException && error.name === "AbortError") {
      errorMessage = "Analysis timed out. Please try again.";
    }

    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive",
    });

    return {
      summary:
        "We encountered issues analyzing your lab report. Please try uploading a clearer image or consult with a healthcare professional.",
      keyFindings: [],
      recommendations: [
        "Try uploading a clearer image with better lighting",
        "Ensure all text is visible and not cut off",
        "Consider scanning the document instead of taking a photo",
        "Consult with a healthcare professional for interpretation",
      ],
      riskFactors: [],
    };
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Helper function to ask follow-up questions about the lab report with improved context
export async function askQuestion(question: string, context: string): Promise<string> {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    // Enhance the prompt to handle more ambiguous questions
    const prompt = `
    You are a medical AI assistant helping to interpret lab results. You should provide helpful, informative responses about medical lab reports.
    
    Context from the lab report: ${context}
    
    User Question: ${question}
    
    Guidelines for your response:
    1. Answer based ONLY on the information in the lab report context provided
    2. If the answer cannot be determined from the context, say so clearly
    3. Provide short, clear explanations for medical terms
    4. For abnormal values, explain the potential implications
    5. Be factual and medically accurate
    6. Avoid speculative diagnoses
    7. If you're uncertain about any aspect, acknowledge it
    
    Provide a detailed but concise answer to the user's question.
    `;
    
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generation_config: {
        temperature: 0.2,
        max_output_tokens: 1024,
        topP: 0.95
      }
    };
    
    // Add timeout handling for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get answer');
    }
    
    const data = await response.json();
    const answer = data.candidates[0]?.content?.parts[0]?.text || 'No answer available';
    
    if (!answer || answer.trim() === '') {
      throw new Error('Empty response when answering question');
    }
    
    return answer;
    
  } catch (error) {
    console.error('Error asking question:', error);
    
    let errorMessage = "Failed to get an answer";
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      errorMessage = "Request timed out. Please try asking again.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Question Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return "I'm sorry, I couldn't process your question due to a technical issue. Please try asking again with a different phrasing.";
  }
}

// Improved helper function to parse AI response into structured format
function parseAIResponse(text: string): AnalysisResult {
  console.log("Parsing AI response");
  
  // Initialize the result with default values
  const result: AnalysisResult = {
    summary: "No summary available",
    keyFindings: [],
    recommendations: [],
    riskFactors: []
  };
  
  // Extract summary section - using more flexible pattern matching
  const summaryPatterns = [
    /SUMMARY:?([\s\S]*?)(?=KEY_FINDINGS:|FINDINGS:|$)/i,
    /SUMMARY:?([\s\S]*?)(?=KEY FINDINGS:|$)/i,
    /OVERALL ASSESSMENT:?([\s\S]*?)(?=KEY_FINDINGS:|FINDINGS:|$)/i
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      result.summary = match[1].trim();
      break;
    }
  }
  
  // Extract key findings with multiple possible headers
  const findingsPatterns = [
    /KEY_FINDINGS:?([\s\S]*?)(?=RECOMMENDATIONS:|$)/i,
    /KEY FINDINGS:?([\s\S]*?)(?=RECOMMENDATIONS:|$)/i,
    /FINDINGS:?([\s\S]*?)(?=RECOMMENDATIONS:|$)/i,
    /ABNORMAL VALUES:?([\s\S]*?)(?=RECOMMENDATIONS:|$)/i
  ];
  
  for (const pattern of findingsPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      result.keyFindings = extractBulletPoints(match[1]);
      break;
    }
  }
  
  // Extract recommendations
  const recommendationsPatterns = [
    /RECOMMENDATIONS:?([\s\S]*?)(?=RISK_FACTORS:|RISKS:|$)/i,
    /SUGGESTED ACTIONS:?([\s\S]*?)(?=RISK_FACTORS:|RISKS:|$)/i,
    /NEXT STEPS:?([\s\S]*?)(?=RISK_FACTORS:|RISKS:|$)/i
  ];
  
  for (const pattern of recommendationsPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      result.recommendations = extractBulletPoints(match[1]);
      break;
    }
  }
  
  // Extract risk factors
  const riskPatterns = [
    /RISK_FACTORS:?([\s\S]*?)(?=$)/i,
    /RISKS:?([\s\S]*?)(?=$)/i,
    /POTENTIAL CONCERNS:?([\s\S]*?)(?=$)/i
  ];
  
  for (const pattern of riskPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim()) {
      result.riskFactors = extractBulletPoints(match[1]);
      break;
    }
  }
  
  // If we don't have a summary but have findings, create a basic summary
  if (result.summary === "No summary available" && result.keyFindings.length > 0) {
    result.summary = `Analysis found ${result.keyFindings.length} key findings to review.`;
  }
  
  // If we didn't get any structured data, extract whatever we can from the response
  if (result.summary === "No summary available" && 
      result.keyFindings.length === 0 && 
      result.recommendations.length === 0 && 
      result.riskFactors.length === 0) {
    
    // Create a basic summary from the text
    result.summary = "The system was able to extract some information from your lab report, but couldn't fully analyze it. Below are the details we could identify:";
    
    // Extract whatever information we can find in the text
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length > 0) {
      // Add the first few lines as key findings
      const potentialFindings = lines.slice(0, Math.min(5, lines.length))
        .map(line => line.replace(/^[0-9\.\-\*\•]+\s*/, '').trim())
        .filter(line => line.length > 10); // only include substantial lines
      
      if (potentialFindings.length > 0) {
        result.keyFindings = potentialFindings;
      } else {
        result.keyFindings = ["Some text was detected in the image but could not be properly structured into findings."];
      }
      
      // Add generic recommendations
      result.recommendations = [
        "Upload a clearer image of your lab report",
        "Make sure all values and reference ranges are visible",
        "Consider consulting with a healthcare professional to review your results"
      ];
    }
  }
  
  console.log("Parsed result:", result);
  return result;
}

// Enhanced helper function to extract bullet points from a text section
function extractBulletPoints(text: string): string[] {
  // First, try to match bullet points starting with - or •
  const bulletMatches = text.match(/[-•*]\s*(.*?)(?=\n[-•*]|$)/gs);
  
  if (bulletMatches && bulletMatches.length > 0) {
    return bulletMatches.map(item => 
      item.replace(/^[-•*]\s*/, '').trim()
    ).filter(Boolean);
  }
  
  // If no bullets found, try numbered lists (1. 2. etc.)
  const numberedMatches = text.match(/\d+\.?\s*(.*?)(?=\n\d+\.?|$)/gs);
  
  if (numberedMatches && numberedMatches.length > 0) {
    return numberedMatches.map(item => 
      item.replace(/^\d+\.?\s*/, '').trim()
    ).filter(Boolean);
  }
  
  // If still no structured format, try to break by lines and clean them up
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => 
      line.length > 5 && 
      !line.match(/^(KEY_FINDINGS|RECOMMENDATIONS|RISK_FACTORS|SUMMARY):?$/i)
    );
  
  if (lines.length > 0) {
    return lines;
  }
  
  // Last resort: if text is a single paragraph, try to split by periods or semicolons
  if (text.length > 20 && !text.includes('\n')) {
    return text.split(/[.;]/)
      .map(item => item.trim())
      .filter(item => item.length > 10);
  }
  
  return [];
}
