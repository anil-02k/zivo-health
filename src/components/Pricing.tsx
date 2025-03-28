
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  const plans = [
    {
      name: "Free",
      description: "Try our basic features",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "3 Lab reports per month",
        "Basic AI analysis",
        "7-day history",
        "Standard support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      description: "Everything you need",
      monthlyPrice: 14.99,
      annualPrice: 149.99,
      features: [
        "Unlimited lab reports",
        "Advanced AI analysis",
        "Unlimited history & trends",
        "Priority support",
        "Export to PDF & sharing",
        "Personal notes & reminders",
      ],
      cta: "Go Premium",
      popular: true,
    },
    {
      name: "Family",
      description: "For your entire family",
      monthlyPrice: 24.99,
      annualPrice: 249.99,
      features: [
        "Up to 5 family profiles",
        "All Premium features",
        "Family health dashboard",
        "Dedicated account manager",
        "Premium support 24/7",
        "Early access to new features",
      ],
      cta: "Choose Family",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that works best for you, with no hidden fees or surprises.
          </p>
          
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-vivo-100 p-1 rounded-full inline-flex">
              <button
                className={`py-2 px-4 rounded-full text-sm font-medium transition ${
                  isAnnual
                    ? "bg-vivo-600 text-white"
                    : "text-vivo-700 hover:bg-vivo-200"
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual (Save 15%)
              </button>
              <button
                className={`py-2 px-4 rounded-full text-sm font-medium transition ${
                  !isAnnual
                    ? "bg-vivo-600 text-white"
                    : "text-vivo-700 hover:bg-vivo-200"
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const period = isAnnual ? "/year" : "/month";
            
            return (
              <div
                key={index}
                className={`rounded-xl overflow-hidden animate-fade-in animation-delay-${
                  index * 300
                } ${
                  plan.popular
                    ? "relative bg-gradient-to-b from-vivo-50 to-white border-2 border-vivo-300 shadow-xl transform scale-105 md:scale-110 z-10"
                    : "glass"
                } card-hover`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-vivo-600 text-white text-center py-1.5 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-foreground/70 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-foreground/70">{period}</span>
                  </div>
                  <Button
                    className={`w-full py-6 ${
                      plan.popular
                        ? "bg-vivo-600 hover:bg-vivo-700 text-white"
                        : "bg-vivo-100 hover:bg-vivo-200 text-vivo-700"
                    } mb-6 btn-hover`}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Check size={18} className="text-mint-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center animate-fade-in animation-delay-900">
          <div className="inline-block glass py-4 px-6 rounded-lg">
            <p className="text-foreground/80">
              <span className="font-medium">All plans include a 14-day money-back guarantee</span> — 
              No credit card required for free trial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
