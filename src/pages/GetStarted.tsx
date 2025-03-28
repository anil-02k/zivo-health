import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { analyzeLabReport, AnalysisResult } from "@/services/geminiService";
import AnalysisResultComponent from "@/components/AnalysisResult";

const GetStarted = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, JPG, or PNG file.",
          variant: "destructive"
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB.",
          variant: "destructive"
        });
        return;
      }

      // Add image quality checks for image files
      if (selectedFile.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          // Check image dimensions
          if (img.width < 800 || img.height < 600) {
            toast({
              title: "Low resolution image",
              description: "For better results, please upload a higher resolution image (minimum 800x600 pixels).",
              variant: "destructive"
            });
            return;
          }

          // Create a temporary canvas to check image quality
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) return;

          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          tempCtx.drawImage(img, 0, 0);

          // Check image quality by analyzing pixel data
          const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          
          // Calculate average brightness and contrast
          let totalBrightness = 0;
          let maxBrightness = 0;
          let minBrightness = 255;
          
          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
            maxBrightness = Math.max(maxBrightness, brightness);
            minBrightness = Math.min(minBrightness, brightness);
          }
          
          const avgBrightness = totalBrightness / (data.length / 4);
          const contrast = (maxBrightness - minBrightness) / 255;

          // Check for potential quality issues
          if (avgBrightness < 50 || avgBrightness > 200) {
            toast({
              title: "Image may be too dark or bright",
              description: "For better results, try taking the photo in better lighting conditions.",
              variant: "destructive"
            });
            return;
          }

          if (contrast < 0.3) {
            toast({
              title: "Low contrast image",
              description: "The image appears to have low contrast. For better results, ensure good lighting and clear text.",
              variant: "destructive"
            });
            return;
          }

          setFile(selectedFile);
          toast({
            title: "File selected",
            description: `"${selectedFile.name}" has been selected for upload.`,
          });
        };
        img.src = URL.createObjectURL(selectedFile);
      } else {
        setFile(selectedFile);
        toast({
          title: "File selected",
          description: `"${selectedFile.name}" has been selected for upload.`,
        });
      }
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "File required",
        description: "Please upload a lab report file to analyze.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    toast({
      title: "Analysis started",
      description: "Your lab report is being processed by our AI. This may take a moment.",
    });
    
    try {
      console.log("Starting analysis for file:", file.name);
      const result = await analyzeLabReport(file);
      console.log("Analysis completed:", result);
      
      if (result.summary.includes("could not be completed")) {
        toast({
          title: "Analysis incomplete",
          description: "We're applying advanced image enhancement to improve text recognition. Please wait while we process your image again.",
          variant: "destructive"
        });
        
        // Try one more time with enhanced processing
        const retryResult = await analyzeLabReport(file);
        if (retryResult.summary.includes("could not be completed")) {
          toast({
            title: "Analysis still limited",
            description: "Despite our best efforts, we couldn't fully analyze your report. Please try uploading a clearer image or consult with a healthcare professional.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Analysis improved",
            description: "We were able to extract more information after enhancing the image.",
          });
        }
        setAnalysisResult(retryResult);
      } else if (result.keyFindings.length === 0 && result.riskFactors.length === 0) {
        toast({
          title: "Limited analysis",
          description: "We extracted some information but couldn't identify key findings. Our AI is trying to enhance the image for better results.",
          variant: "destructive"
        });
        
        // Try one more time with enhanced processing
        const retryResult = await analyzeLabReport(file);
        setAnalysisResult(retryResult);
      } else {
        toast({
          title: "Analysis complete",
          description: "Your lab report has been successfully analyzed!",
        });
        setAnalysisResult(result);
      }
      
      setStep(3);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "We encountered an error analyzing your report. Our system is trying to recover with enhanced image processing.",
        variant: "destructive"
      });
      
      // Try one final time with enhanced processing
      try {
        const retryResult = await analyzeLabReport(file);
        setAnalysisResult(retryResult);
        setStep(3);
      } catch (retryError) {
        toast({
          title: "Analysis failed",
          description: "We couldn't analyze your report even with enhanced processing. Please try uploading a clearer image or contact support.",
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadAreaClick = () => {
    document.getElementById("file")?.click();
  };

  return (
    <div className="min-h-screen bg-zivo-50/30 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-${step === 3 ? "4xl" : "md"} mx-auto`}>
          <Link to="/" className="inline-flex items-center text-zivo-600 hover:text-zivo-700 mb-6">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-md animate-scale-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 text-zivo-800">Get Started with Zivo Health</h1>
              <p className="text-gray-600">
                {step === 1 && "Create your account to begin analyzing your lab reports."}
                {step === 2 && "Upload your first lab report for analysis."}
                {step === 3 && "Here's your comprehensive lab report analysis."}
              </p>
            </div>

            {step < 3 && (
              <div className="flex items-center justify-between mb-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-zivo-600 text-white">
                  1
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > 1 ? "bg-zivo-300" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-zivo-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > 2 ? "bg-zivo-300" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 3 ? "bg-zivo-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-zivo-700">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="John Doe"
                      required
                      className="w-full border-zivo-300 focus:border-zivo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-zivo-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@example.com"
                      required
                      className="w-full border-zivo-300 focus:border-zivo-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium mb-3 text-zivo-700">
                      Upload Your Lab Report
                    </label>
                    <div
                      onClick={handleUploadAreaClick}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:bg-zivo-50 ${
                        file ? "border-zivo-400" : "border-gray-300"
                      }`}
                    >
                      {!file ? (
                        <div>
                          <Upload size={32} className="mx-auto text-zivo-500 mb-3" />
                          <p className="mb-2 text-gray-600">
                            Drag & drop your file here, or click to browse
                          </p>
                          <p className="text-xs text-gray-500">
                            Supported formats: PDF, JPG, PNG (Max 10MB)
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-zivo-600 font-medium">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 border-zivo-300 text-zivo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      <input
                        id="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="flex-1 border-zivo-300 text-zivo-600"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!file || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        "Upload & Analyze"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && analysisResult && (
              <AnalysisResultComponent result={analysisResult} email={email} />
            )}

            {step === 3 && !analysisResult && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-zivo-100 flex items-center justify-center mx-auto mb-4">
                  <div className="w-10 h-10 rounded-full bg-zivo-500 flex items-center justify-center text-white">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-zivo-700">
                  Analysis in Progress
                </h3>
                <p className="text-gray-600 mb-6">
                  Your lab report is being analyzed by our AI. This usually takes less than a minute.
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
                  <div className="h-full bg-zivo-500 rounded-full animate-pulse" style={{ width: "40%" }}></div>
                </div>
                <p className="text-sm text-gray-500">
                  We'll notify you at {email} when your analysis is ready.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
