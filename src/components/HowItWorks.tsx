
import { FileUp, Brain, MessageSquareText } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FileUp size={24} className="text-vivo-500" />,
      title: "Upload your lab report",
      description:
        "Simply upload your medical lab reports in PDF or image format. Our system securely processes all your health data.",
    },
    {
      icon: <Brain size={24} className="text-vivo-500" />,
      title: "Get an AI-generated summary & insights",
      description:
        "Our advanced AI analyzes your results, highlights important findings, and translates medical jargon into plain language.",
    },
    {
      icon: <MessageSquareText size={24} className="text-vivo-500" />,
      title: "Ask follow-up questions via chatbot",
      description:
        "Have questions about your results? Our AI chatbot provides clear, medically-informed responses to your health queries.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-vivo-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Zivo Works for You
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our simple 3-step process turns complex medical data into clear, 
            actionable health insights in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`glass rounded-xl p-8 relative animate-fade-in animation-delay-${index * 300}`}
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center bg-vivo-600 text-white font-bold shadow-lg">
                {index + 1}
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-vivo-100 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in animation-delay-900">
          <div className="inline-block glass py-4 px-6 rounded-lg">
            <p className="text-foreground/80">
              <span className="font-medium">Most lab reports analyzed in under 60 seconds</span> — 
              backed by medical professionals and the latest health research
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
