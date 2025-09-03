"use client";

import { useEffect, useRef } from "react";
import testimonials, { Testimonial } from "./data";

const TestimonialSlider = () => {
  const infiniteTestimonials = [...testimonials, ...testimonials];
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animation: number;
    let pos = 0;
    const totalWidth = testimonials.length * 320;
    let isPaused = false;

    const step = () => {
      if (!isPaused && slider) {
        pos -= 1;
        if (Math.abs(pos) >= totalWidth) {
          pos = 0;
        }
        slider.style.transform = `translateX(${pos}px)`;
      }
      animation = requestAnimationFrame(step);
    };

    animation = requestAnimationFrame(step);

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    if (slider) {
      slider.addEventListener("mouseenter", handleMouseEnter);
      slider.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animation);
      if (slider) {
        slider.removeEventListener("mouseenter", handleMouseEnter);
        slider.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-start p-4 pt-12 font-raleway">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-[44px] font-normal text-white mb-3 font-raleway">
            Customer Feedback
          </h1>
          <p className="text-gray-300 text-[18px] max-w-2xl font-normal mx-auto font-raleway">
            We appreciate your input and would like to take a moment to provide
            you with some detailed feedback specifically to your experience.
          </p>
        </div>

        {/* Slider */}
        <div className="overflow-hidden relative w-full pt-12 pb-6 mt-16">
          <div
            ref={sliderRef}
            className="flex space-x-6 transition-none"
            style={{ width: `${infiniteTestimonials.length * 320}px` }}
          >
            {infiniteTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-[600px] flex-shrink-0 border border-gray-700 rounded-xl p-6 h-[280px] flex flex-col transform transition-transform duration-300 hover:scale-105 font-raleway"
              >
                {/* Avatar */}
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white font-raleway">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400 text-base font-raleway">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative">
                  <p className="text-gray-300 leading-relaxed relative z-10 font-normal text-[19px] font-raleway">
                    {testimonial.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
