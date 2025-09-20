import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Homeowner",
      // Change: Replaced Unsplash URLs with reliable Imgur links
      image: "https://i.imgur.com/e2v5pY0.jpg",
      rating: 5,
      comment:
        "ArchHome helped us design our dream house perfectly. The team was professional and the process was seamless. Highly recommended!",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Real Estate Developer",
      // Change: Replaced Unsplash URLs with reliable Imgur links
      image: "https://i.imgur.com/nKNbC2b.jpg",
      rating: 5,
      comment:
        "Outstanding architectural designs and excellent customer service. We have used their services for multiple projects and are always satisfied.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Interior Designer",
      // Change: Replaced Unsplash URLs with reliable Imgur links
      image: "https://i.imgur.com/8sC2s0d.jpg",
      rating: 5,
      comment:
        "The 3D visualizations are incredible! It really helped my clients understand the final outcome. Great attention to detail.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-20 bg-soft-teal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Trusted by thousands of satisfied customers worldwide
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-3xl shadow-large p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/20">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                )
              )}
            </div>

            <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
              "{testimonials[currentTestimonial].comment}"
            </blockquote>

            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {testimonials[currentTestimonial].name}
              </h4>
              <p className="text-muted-foreground">
                {testimonials[currentTestimonial].role}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-medium border-2 border-primary/20 hover:border-primary"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-medium border-2 border-primary/20 hover:border-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentTestimonial === index ? "bg-primary" : "bg-primary/20"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
