import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllPackages } from "@/lib/features/packages/packageSlice";
import { Button } from "@/components/ui/button";

const StandardPackagesSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { packages, status, error } = useSelector(
    (state: RootState) => state.packages
  );

  useEffect(() => {
    dispatch(fetchAllPackages());
  }, [dispatch]);

  const standardPackages = packages.filter(
    (pkg) => pkg.packageType === "standard"
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (status === "loading") {
    return (
      <section className="py-16 bg-soft-teal">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Loading Packages...</p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4 text-center text-red-600">
          <h3 className="text-2xl font-bold">Something went wrong!</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-soft-teal">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Standard Packages
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            Choose the plan that's right for you.
          </p>
        </motion.div>

        {/* Slider for all views */}
        <div className="relative">
          {standardPackages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white hidden md:flex"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0 snap-x snap-mandatory"
          >
            {/* Hide scrollbar */}
            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; } .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            {standardPackages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[45vw] lg:w-[30vw] xl:w-[23vw] snap-start bg-card border-2 rounded-xl text-center transition-all duration-300 relative flex flex-col h-[450px] md:h-[520px]
                  ${pkg.isPopular ? "border-primary shadow-lg" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10 whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}

                {/* Scrollable Content Area */}
                <div className="flex-grow overflow-y-auto px-4 md:px-5 pt-6 pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">
                    {pkg.title}
                  </h3>

                  {/* Price */}
                  <div className="mb-2 md:mb-3">
                    <span className="text-3xl md:text-4xl font-extrabold text-primary">{`₹${pkg.price}`}</span>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {pkg.unit}
                    </p>
                  </div>

                  {/* Area Type */}
                  <p className="text-xs text-muted-foreground mb-3">
                    {pkg.areaType}
                  </p>

                  {/* Features - Compact */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="text-left mt-2 text-xs space-y-1">
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <CheckCircle
                            size={12}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-foreground leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Includes - Compact */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="text-left mt-2 text-xs space-y-1">
                      <p className="font-bold text-foreground mb-1">
                        Includes:
                      </p>
                      {pkg.includes.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle
                            size={12}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-foreground leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Note - Compact */}
                  {pkg.note && (
                    <div className="text-left mt-2 text-xs text-muted-foreground border-t pt-2 italic">
                      {pkg.note}
                    </div>
                  )}
                </div>

                {/* CTA Button - Fixed at Bottom */}
                <div className="px-4 md:px-5 pb-4 pt-3 border-t bg-card">
                  <Link
                    to="/booking-form"
                    state={{
                      packageName: pkg.title,
                      packageUnit: pkg.unit,
                      packagePrice: pkg.price,
                    }}
                    className="w-full btn-primary text-center block text-sm py-2.5 rounded-lg font-semibold"
                  >
                    Choose Plan
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandardPackagesSection;
