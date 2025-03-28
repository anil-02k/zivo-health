
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  // FAQ Items with question and answer pairs
  const faqItems = [
    {
      question: "How accurate is the AI analysis of lab reports?",
      answer:
        "Our AI is trained on millions of medical datasets and regularly updated with the latest medical research. It achieves over 97% accuracy compared to human medical experts. However, we always recommend consulting healthcare professionals for critical health decisions.",
    },
    {
      question: "Is my health data secure and private?",
      answer:
        "Yes. We take your privacy extremely seriously. All data is encrypted both in transit and at rest using bank-level security protocols. We're HIPAA compliant and never sell your personal health data to third parties.",
    },
    {
      question: "What types of lab reports can Vivo analyze?",
      answer:
        "Vivo can analyze most common blood tests, including complete blood count (CBC), comprehensive metabolic panel (CMP), lipid panels, thyroid function tests, HbA1c, and various other specialized laboratory tests. We're constantly expanding our capabilities.",
    },
    {
      question: "How do I upload my lab reports?",
      answer:
        "You can upload PDFs or images of your lab reports directly through our secure web interface or mobile app. Simply take a photo or select the file, and our AI automatically extracts and processes the data.",
    },
    {
      question: "Can I use Vivo if I don't have a lab report yet?",
      answer:
        "Yes! You can still use our AI chatbot to ask general health questions and learn about different lab tests and health markers. However, for personalized analysis, you'll need to upload a lab report.",
    },
    {
      question: "Does Vivo replace my doctor?",
      answer:
        "No, Vivo is designed to complement, not replace, your healthcare provider. We help you better understand your health data and prepare more informed questions for your doctor, but we don't provide medical diagnoses or treatment plans.",
    },
  ];

  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle function for opening/closing FAQs
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-vivo-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Have questions about Vivo? Find quick answers to common questions below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in animation-delay-300">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="mb-4 glass rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold">{item.question}</h3>
                <ChevronDown
                  size={20}
                  className={`transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  } text-vivo-600`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-6 pt-0 text-foreground/70">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in animation-delay-600">
          <p className="text-lg">
            Still have questions?{" "}
            <a
              href="#"
              className="text-vivo-600 font-medium hover:text-vivo-700 transition-colors border-b-2 border-vivo-200 hover:border-vivo-600"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
