import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnalysisResult } from "@/services/geminiService";
import { askQuestion } from "@/services/geminiService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Tag, Sparkles } from "lucide-react";

interface AnalysisResultProps {
  result: AnalysisResult;
  email: string;
}

const AnalysisResultComponent: React.FC<AnalysisResultProps> = ({ result, email }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question to ask about your lab results.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare context from analysis result for better answers
      const context = `
        Summary: ${result.summary}
        Key Findings: ${result.keyFindings.join(', ')}
        Recommendations: ${result.recommendations.join(', ')}
        Risk Factors: ${result.riskFactors.join(', ')}
      `;
      
      const response = await askQuestion(question, context);
      setAnswer(response);
    } catch (error) {
      console.error("Error asking question:", error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we likely have a low-quality analysis
  const isLowQualityAnalysis = 
    (result.keyFindings.length === 0 && result.riskFactors.length === 0) || 
    result.summary.includes("could not be completed");

  return (
    <div className="space-y-6 animate-fade-in">
      {isLowQualityAnalysis && (
        <Card className="border border-amber-300 bg-amber-50">
          <CardContent className="pt-6 pb-4 flex items-start">
            <AlertTriangle className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Limited Analysis Available</h3>
              <p className="text-sm text-amber-700 mb-3">
                We had difficulty extracting complete information from your lab report image. 
                The analysis below may be incomplete. For better results:
              </p>
              <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
                <li>Ensure the image is clear and well-lit</li>
                <li>Make sure all text is visible and not cut off</li>
                <li>Try taking the photo in better lighting conditions</li>
                <li>Hold the camera steady and perpendicular to the document</li>
                <li>Consider scanning the document instead of taking a photo</li>
              </ul>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="text-amber-700 border-amber-300 hover:bg-amber-100"
                  onClick={() => window.location.reload()}
                >
                  Try Uploading Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-zivo-200">
        <CardHeader className="bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-zivo-600">Analysis Summary</CardTitle>
              <CardDescription>Overall assessment of your health indicators</CardDescription>
            </div>
            <div className="bg-mint-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
              <Sparkles size={14} className="mr-1" />
              NEW
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          <p className="text-foreground/80 whitespace-pre-line">{result.summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-zivo-200">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="text-lg text-zivo-600">Key Findings</CardTitle>
            <CardDescription>Important markers from your lab work</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 bg-white">
            {result.keyFindings.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {result.keyFindings.map((finding, index) => (
                  <li key={index} className="text-sm text-foreground">{finding}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/70">
                No key findings could be detected. This might be due to image quality issues, 
                or all your results may be within normal ranges.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-zivo-200">
          <CardHeader className="bg-white rounded-t-lg">
            <CardTitle className="text-lg text-zivo-600">Recommendations</CardTitle>
            <CardDescription>Suggested next steps</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 bg-white">
            {result.recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-foreground">{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground/70">
                No specific recommendations were generated. Consider consulting with a 
                healthcare professional about your results.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-zivo-200">
        <CardHeader className="bg-white rounded-t-lg">
          <CardTitle className="text-lg text-zivo-600">Risk Factors</CardTitle>
          <CardDescription>Areas that may need attention</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          {result.riskFactors.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {result.riskFactors.map((risk, index) => (
                <li key={index} className="text-sm text-foreground">{risk}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/70">
              No significant risk factors were identified in the analysis. 
              This may be due to image quality or all values being within normal ranges.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-zivo-200">
        <CardHeader className="bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-zivo-600">Ask About Your Results</CardTitle>
              <CardDescription>Get answers to specific questions about your lab report</CardDescription>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
              COMING SOON
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 bg-white">
          <Textarea
            placeholder="E.g., What does my cholesterol level mean? Is my vitamin D level normal?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px] border-zivo-300 focus:border-zivo-500"
          />
          
          <Button 
            onClick={handleAskQuestion} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Answer...
              </>
            ) : (
              "Ask Question"
            )}
          </Button>
          
          {answer && (
            <div className="mt-4 p-4 bg-zivo-50 rounded-md border border-zivo-200">
              <h4 className="font-medium mb-2 text-zivo-700">Answer:</h4>
              <p className="text-sm text-foreground whitespace-pre-line">{answer}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-foreground/60 bg-white rounded-b-lg border-t border-zivo-100">
          Questions and answers are processed by AI and should not replace professional medical advice.
        </CardFooter>
      </Card>

      <Card className="border border-zivo-200">
        <CardHeader className="bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-zivo-600">Personal Notes</CardTitle>
              <CardDescription>Add your own notes about this lab report</CardDescription>
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
              COMING SOON
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 bg-white">
          <Textarea
            placeholder="Add your personal notes here... (Feature coming soon)"
            className="min-h-[100px] border-zivo-300 focus:border-zivo-500"
            disabled
          />
          <div className="mt-3">
            <Button 
              className="bg-gray-400 hover:bg-gray-500 text-white"
              disabled
            >
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-foreground/70 mt-6">
        A detailed report has been sent to {email}. You can also contact our health experts for a personalized consultation.
      </div>
    </div>
  );
};

export default AnalysisResultComponent;
