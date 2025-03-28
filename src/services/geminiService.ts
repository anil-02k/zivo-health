import { toast } from "@/hooks/use-toast";
import * as Tesseract from 'tesseract.js';

// Add image preprocessing functions
async function preprocessImage(base64File: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate average brightness and contrast
      let totalBrightness = 0;
      let pixelCount = 0;
      let minGray = 255;
      let maxGray = 0;

      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalBrightness += gray;
        minGray = Math.min(minGray, gray);
        maxGray = Math.max(maxGray, gray);
        pixelCount++;
      }
      const averageBrightness = totalBrightness / pixelCount;
      const contrast = maxGray - minGray;

      // Apply adaptive enhancement based on image characteristics
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Apply contrast enhancement based on image contrast
        const contrastFactor = contrast < 100 ? 1.5 : 1.2;
        let enhanced = ((gray - 128) * contrastFactor) + 128;
        
        // Apply brightness correction based on average
        if (averageBrightness < 100) {
          // Image is too dark
          enhanced = Math.min(255, enhanced + 40);
        } else if (averageBrightness > 200) {
          // Image is too bright
          enhanced = Math.max(0, enhanced - 40);
        }
        
        // Apply adaptive thresholding with noise reduction
        const threshold = 128 + (averageBrightness - 128) * 0.2;
        const noiseThreshold = 10;
        const value = Math.abs(enhanced - threshold) > noiseThreshold 
          ? (enhanced > threshold ? 255 : 0)
          : enhanced;
        
        // Set RGB values with slight edge enhancement
        const edgeFactor = 1.1;
        data[i] = Math.min(255, value * edgeFactor);     // R
        data[i + 1] = Math.min(255, value * edgeFactor); // G
        data[i + 2] = Math.min(255, value * edgeFactor); // B
      }

      // Apply sharpening for better text clarity
      const sharpenMatrix = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
      ];
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        const tempImageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const tempData = tempImageData.data;

        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < canvas.width - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let sum = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c;
                  sum += tempData[idx] * sharpenMatrix[(ky + 1) * 3 + (kx + 1)];
                }
              }
              const idx = (y * canvas.width + x) * 4 + c;
              data[idx] = Math.min(255, Math.max(0, sum));
            }
          }
        }
      }

      // Put the enhanced image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert back to base64 with high quality
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64File;
  });
}

// Update with the provided API key
const API_KEY = "AIzaSyA_BIOY5WEPM11XGG0tQYbDJlkV-uJ8lHI";

export interface AnalysisResult {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  riskFactors: string[];
}

export async function analyzeLabReport(file: File): Promise<AnalysisResult> {
  try {
    console.log("Starting analysis for file:", file.name);
    
    const isImage = file.type.startsWith('image/');
    let extractedText = "";
    
    if (isImage) {
      try {
        // Convert file to base64
        const base64File = await fileToBase64(file);
        
        // Show processing status
        toast({
          title: "Processing image",
          description: "Optimizing image for text recognition...",
        });
        
        // Upscale the image if it's too small
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = base64File;
        });
        
        // Check if image needs upscaling (width or height less than 300px)
        if (img.width < 300 || img.height < 300) {
          console.log("Upscaling low resolution image");
          const upscaledImage = await upscaleImage(base64File);
          extractedText = await performOCR(upscaledImage);
        } else {
          extractedText = await performOCR(base64File);
        }
        
        if (extractedText.length < 50) {
          console.log("Warning: Limited text extracted");
          toast({
            title: "Limited text extraction",
            description: "We extracted some text but it may be incomplete. Continuing with analysis...",
            variant: "destructive"
          });
        }
      } catch (ocrError) {
        console.error("OCR error:", ocrError);
        toast({
          title: "Text extraction limited",
          description: "We'll continue with direct image analysis.",
          variant: "destructive"
        });
      }
    }
    
    // Prepare Gemini API request
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const prompt = `
    You are a medical AI assistant analyzing a lab report.
    
    ${extractedText ? "Extracted text from the report:\n\n" + extractedText + "\n\n" : ""}
    
    Instructions:
    1. Analyze the ${extractedText ? "extracted text" : "lab report image"} thoroughly
    2. Focus on medical values, ranges, and abnormalities
    3. Provide clear, actionable insights
    4. If information is limited, make reasonable assumptions based on standard lab report formats
    
    Format your response as:
    
    SUMMARY: Brief overview of findings
    
    KEY_FINDINGS:
    - List important values and abnormalities
    
    RECOMMENDATIONS:
    - Actionable health advice
    
    RISK_FACTORS:
    - Potential health concerns
    `;
    
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generation_config: {
        temperature: 0.1,
        max_output_tokens: 2048,
        topP: 0.95,
        topK: 40
      }
    };
    
    // Add image data if needed
    if (!extractedText || extractedText.length < 100 || file.type === 'application/pdf') {
      const base64File = await fileToBase64(file);
      const base64Data = base64File.split(',')[1];
      
      payload.contents[0].parts.push({
        inline_data: {
          mime_type: file.type,
          data: base64Data
        }
      });
    }
    
    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('Failed to analyze lab report');
    }
    
    const data = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text || '';
    
    if (!aiText.trim()) {
      throw new Error('Empty response from AI');
    }
    
    return parseAIResponse(aiText);
    
  } catch (error) {
    console.error('Analysis error:', error);
    
    let errorMessage = "Failed to analyze lab report";
    if (error instanceof DOMException && error.name === 'AbortError') {
      errorMessage = "Analysis timed out. Please try again.";
    }
    
    toast({
      title: "Analysis Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return {
      summary: "We encountered issues analyzing your lab report. Please try uploading a clearer image or consult with a healthcare professional.",
      keyFindings: [],
      recommendations: [
        "Try uploading a clearer image with better lighting",
        "Ensure all text is visible and not cut off",
        "Consider scanning the document instead of taking a photo",
        "Consult with a healthcare professional for interpretation"
      ],
      riskFactors: []
    };
  }
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

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Function to upscale low resolution images
async function upscaleImage(base64File: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate new dimensions for upscaling
      const TARGET_WIDTH = 1200; // Target width for better OCR
      const TARGET_HEIGHT = 1600; // Target height for better OCR
      
      // Calculate scaling factor while maintaining aspect ratio
      const scaleX = TARGET_WIDTH / img.width;
      const scaleY = TARGET_HEIGHT / img.height;
      const scale = Math.min(scaleX, scaleY);
      
      const newWidth = Math.round(img.width * scale);
      const newHeight = Math.round(img.height * scale);

      // Set canvas size to new dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and upscale the image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert back to base64 with high quality
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64File;
  });
}

// Enhanced OCR function with retries
async function performOCR(imageData: string, retryCount = 0): Promise<string> {
  const MAX_RETRIES = 2;
  
  try {
    // First attempt with default settings
    const result = await Tesseract.recognize(
      imageData,
      'eng',
      {
        logger: m => console.log(m),
        workerOptions: {
          corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
          langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        },
        // Optimized settings for low resolution images
        tessedit_pageseg_mode: '3', // Fully automatic page segmentation
        tessedit_ocr_engine_mode: '2', // Use LSTM OCR Engine Mode
        tessedit_enable_doc_dict: '1', // Enable dictionary for better word recognition
        tessedit_enable_bigram_correction: '1', // Enable context-based correction
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;()[]{}<>/-_%',
        tessedit_do_invert: '1', // Invert colors for better text detection
      }
    );

    const extractedText = result.data.text.trim();
    
    // Check if we got meaningful text
    if (extractedText.length < 50 && retryCount < MAX_RETRIES) {
      console.log(`Retry ${retryCount + 1}: Not enough text extracted`);
      
      // Try with different settings on retry
      const retryResult = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: m => console.log(m),
          workerOptions: {
            corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
            langPath: 'https://tessdata.projectnaptha.com/4.0.0',
          },
          // Different settings for retry
          tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
          tessedit_ocr_engine_mode: '3', // Legacy + LSTM engines
          tessedit_enable_doc_dict: '1',
          tessedit_enable_bigram_correction: '1',
          tessedit_do_invert: '0', // Try without inversion
        }
      );
      
      return retryResult.data.text.trim();
    }

    return extractedText;
  } catch (error) {
    console.error(`OCR attempt ${retryCount + 1} failed:`, error);
    if (retryCount < MAX_RETRIES) {
      return performOCR(imageData, retryCount + 1);
    }
    throw error;
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
