
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Jason M.",
      avatar: "J",
      role: "Fitness Coach",
      content:
        "As a fitness coach, I need to understand my clients' health metrics. Vivo makes it easy to interpret complex lab reports and provide better guidance on nutrition and exercise plans.",
      rating: 5,
      avatarColor: "bg-vivo-100",
      textColor: "text-vivo-700",
    },
    {
      name: "Sarah K.",
      avatar: "S",
      role: "Busy Parent",
      content:
        "I used to spend hours researching my family's lab results. Vivo saved me so much time by explaining everything clearly and alerting me to the values I should discuss with our doctor.",
      rating: 5,
      avatarColor: "bg-mint-100",
      textColor: "text-mint-700",
    },
    {
      name: "Robert J.",
      avatar: "R",
      role: "Managing Cholesterol",
      content:
        "The AI chatbot feature is incredible. I had follow-up questions about my cholesterol results, and got instant, easy-to-understand answers that helped me make better dietary choices.",
      rating: 4,
      avatarColor: "bg-vivo-200",
      textColor: "text-vivo-800",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-vivo-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of health-conscious individuals who are taking control
            of their health data with Zivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass rounded-xl p-6 animate-fade-in animation-delay-${index * 300} card-hover`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full ${testimonial.avatarColor} ${testimonial.textColor} flex items-center justify-center font-bold mr-3`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-foreground/80 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in animation-delay-900">
          <div className="inline-block glass py-6 px-8 rounded-lg max-w-3xl">
            <p className="text-lg font-medium mb-2">
              "Zivo has revolutionized how I understand my health data. It's like having a medical translator in my pocket."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-vivo-600 font-bold mr-3">
                M
              </div>
              <div className="text-left">
                <p className="font-semibold">Michael T.</p>
                <p className="text-sm text-foreground/60">Health Tech Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
