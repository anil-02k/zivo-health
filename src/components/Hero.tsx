
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <div className="inline-block px-3 py-1 rounded-full bg-vivo-100 text-vivo-700 font-medium text-sm mb-6">
              AI-Powered Health Analytics
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              AI-Powered Lab Report Analysis for{" "}
              <span className="text-vivo-600">Smarter Health Decisions</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-lg">
              Understand your lab results with AI-driven insights and expert recommendations. 
              No more medical jargon – just clear, actionable health information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-vivo-600 hover:bg-vivo-700 text-white px-6 py-6 text-lg rounded-xl btn-hover"
              >
                <Link to="/get-started" className="flex items-center">
                  Get Started – Try for Free
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6 py-6 text-lg border-2 rounded-xl btn-hover border-vivo-200 text-foreground hover:bg-vivo-50"
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-vivo-200 flex items-center justify-center text-vivo-700 font-medium">J</div>
                <div className="w-8 h-8 rounded-full bg-mint-200 flex items-center justify-center text-mint-700 font-medium">S</div>
                <div className="w-8 h-8 rounded-full bg-vivo-300 flex items-center justify-center text-white font-medium">K</div>
              </div>
              <p className="text-muted-foreground">
                Trusted by <span className="font-medium text-foreground">10,000+</span> health-conscious individuals
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-in animation-delay-300">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-vivo-400 to-mint-400 rounded-3xl blur-xl opacity-50 animate-pulse-soft"></div>
              <div className="relative glass rounded-3xl overflow-hidden p-6 animate-float">
                <div className="w-full max-w-md">
                  <div className="bg-vivo-50 rounded-xl p-4 mb-4">
                    <h3 className="font-medium text-vivo-800 mb-2">Your Cholesterol Profile</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">LDL</span>
                        <div className="flex items-center">
                          <span className="text-foreground font-medium">125 mg/dL</span>
                          <div className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Borderline</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">HDL</span>
                        <div className="flex items-center">
                          <span className="text-foreground font-medium">58 mg/dL</span>
                          <div className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Optimal</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-foreground/70">Triglycerides</span>
                        <div className="flex items-center">
                          <span className="text-foreground font-medium">132 mg/dL</span>
                          <div className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Normal</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h3 className="font-medium text-vivo-800 mb-2">AI Analysis</h3>
                    <p className="text-sm text-foreground/80 mb-3">
                      Your cholesterol levels show slight elevation in LDL ("bad" cholesterol). 
                      This puts you at a slightly increased risk for heart disease.
                    </p>
                    <div className="bg-mint-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-mint-800 mb-1">Recommendations</h4>
                      <ul className="text-xs text-foreground/80 space-y-1.5">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5 mr-1.5"></span>
                          Consider limiting saturated fats from red meat and dairy
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5 mr-1.5"></span>
                          Increase soluble fiber intake (oatmeal, beans, fruits)
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-mint-500 mt-1.5 mr-1.5"></span>
                          Aim for 150min/week of moderate physical activity
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
