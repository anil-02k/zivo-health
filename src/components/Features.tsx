
import { 
  FileText, 
  MessageCircle, 
  Clipboard, 
  Video,
  ShieldCheck,
  Clock,
  Sparkles
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: <FileText size={32} className="text-vivo-500" />,
      title: "Lab Report Analysis",
      description:
        "Our AI analyzes your lab tests, providing easy-to-understand summaries of key health indicators and highlighting areas that need attention.",
      isNew: true,
    },
    {
      icon: <MessageCircle size={32} className="text-vivo-500" />,
      title: "AI Chatbot",
      description:
        "Have follow-up questions? Our medical AI assistant answers your health queries in plain language, without the medical jargon.",
      isNew: false,
      comingSoon: true,
    },
    {
      icon: <Clipboard size={32} className="text-vivo-500" />,
      title: "Personal Notes",
      description:
        "Attach personal notes to your reports to track symptoms, medication changes, or questions for your next doctor's appointment.",
      isNew: false,
      comingSoon: true,
    },
    {
      icon: <Video size={32} className="text-vivo-500" />,
      title: "Doctor Consultation",
      description:
        "Coming soon! Connect with licensed healthcare providers for personalized advice based on your lab results and health history.",
      isNew: false,
      comingSoon: true,
    },
  ];

  const additionalFeatures = [
    {
      icon: <ShieldCheck size={20} className="text-vivo-500" />,
      title: "HIPAA Compliant",
      description: "Your health data is protected with bank-level security and encryption.",
    },
    {
      icon: <Clock size={20} className="text-vivo-500" />,
      title: "Historical Tracking",
      description: "Monitor changes in your health metrics over time with visual trends.",
    },
    {
      icon: <Sparkles size={20} className="text-vivo-500" />,
      title: "Personalized Insights",
      description: "Receive recommendations tailored to your unique health profile.",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features That Empower Your Health Journey
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Vivo combines cutting-edge AI technology with intuitive design to give you
            complete control of your health data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className={`glass rounded-xl p-6 card-hover animate-fade-in animation-delay-${
                index * 300
              } relative overflow-hidden ${
                feature.comingSoon ? "opacity-90" : ""
              }`}
            >
              {feature.isNew && (
                <div className="absolute right-0 top-0">
                  <div className="bg-mint-500 text-white text-xs font-bold px-2 py-1 transform rotate-0 origin-top-right">
                    NEW
                  </div>
                </div>
              )}
              {feature.comingSoon && (
                <div className="absolute left-0 bottom-0 right-0 py-2 bg-vivo-500 text-white text-xs font-medium text-center">
                  COMING SOON
                </div>
              )}
              <div className="h-16 flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-vivo-100 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
              <p className="text-foreground/70 text-center">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-vivo-50 to-mint-50 rounded-2xl p-8 animate-fade-in animation-delay-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
