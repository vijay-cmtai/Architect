import React, { FC } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Award,
  TrendingUp,
  Quote,
  ArrowRight,
  Home,
  Building,
  Warehouse,
  SquareStack,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProperties } from "@/redux/features/properties/propertySlice";
import {
  getWishlist,
  toggleWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Skeleton component remains the same
const PropertyCardSkeleton: FC = () => (
  <Card className="overflow-hidden animate-pulse">
    <div className="h-52 bg-muted"></div>
    <CardContent className="p-4 space-y-3">
      <div className="h-5 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="flex justify-between items-center pt-3 mt-2 border-t">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="h-8 w-8 bg-muted rounded-full"></div>
      </div>
    </CardContent>
  </Card>
);

const Index: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const { properties, isLoading } = useAppSelector(
    (state: RootState) => state.properties
  );
  const { itemIds: wishlistedIds } = useAppSelector(
    (state: RootState) => state.wishlist
  );

  React.useEffect(() => {
    dispatch(getProperties({ isFeatured: true, limit: 6 }));
    if (user) {
      dispatch(getWishlist());
    }
  }, [dispatch, user]);

  const handleToggleWishlist = (propertyId: string) => {
    if (!user) {
      toast.error("Please log in to save properties to your wishlist.");
      navigate("/auth");
      return;
    }
    dispatch(toggleWishlist(propertyId));
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  // Animation variants for a staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Data for other sections
  const cityData = [
    {
      city: "Mumbai",
      img: "https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      city: "Delhi",
      img: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
      className: "",
    },
    {
      city: "Bangalore",
      img: "https://s7ap1.scene7.com/is/image/incredibleindia/vidhana-soudha-bangalore-karnataka-hero?qlt=82&ts=1742199603184",
      className: "",
    },
  ];
  const testimonials = [
    {
      name: "Rohan & Priya",
      city: "Mumbai",
      quote:
        "Investors Deaal made our dream of owning a home in Mumbai a reality. The process was so smooth and transparent. Highly recommended!",
    },
    {
      name: "Amit Singh",
      city: "Delhi",
      quote:
        "Found the perfect office space for my startup through this platform. The expert guidance and verified listings were invaluable.",
    },
    {
      name: "Sneha Reddy",
      city: "Bangalore",
      quote:
        "As a first-time investor, I was nervous. The market insights provided by Investors Deaal helped me make a confident and profitable decision.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* === START: NEW BANNER SECTION AS PER YOUR DESIGN === */}
      <section
        className="relative text-white pt-32 pb-20 min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center"
        >
          {/* === YAHAN BADLAV KIYA GAYA HAI === */}
          {/* Logo Image */}
          <motion.div variants={itemVariants}>
            <img
              src="/investor-logo.png" // Yakeen kar lein ki yeh file public folder mein hai
              alt="Investors Deaal Logo"
              className="w-28 h-auto mx-auto mb-4" // Logo ka size yahan se control karein
            />
          </motion.div>
          {/* === BADLAV KHATAM === */}

          {/* Company Name */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
          >
            Investors Deaal
          </motion.h1>

          {/* Tagline 1 */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 mb-4 font-light tracking-widest"
          >
            Land to Legacy
          </motion.p>

          {/* Tagline 2 */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-3xl mb-12"
          >
            India's first Real Estate technology-based company platform.
          </motion.p>

          {/* Main Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mb-12 tracking-tighter"
          >
            Find Your Next <br className="md:hidden" />
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Dream Property
            </span>{" "}
            in India
          </motion.h2>

          {/* Categories */}
          <motion.div variants={itemVariants} className="w-full max-w-5xl">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                "Residential",
                "Commercial",
                "Agriculture",
                "Industrial",
                "Resale",
                "New Launch",
                "Upcoming",
                "Emergency",
              ].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20 hover:border-white/40 transition-colors px-6 py-2 text-base"
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>
      {/* === END: NEW BANNER SECTION === */}

      {/* The rest of the page remains the same */}

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hand-picked premium properties from our exclusive collection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && properties.length === 0
              ? [...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)
              : properties.map((property) => (
                  <div
                    key={property._id}
                    onClick={() => handlePropertyClick(property._id)}
                    className="cursor-pointer"
                  >
                    <PropertyCard
                      property={property}
                      isWishlisted={wishlistedIds.includes(property._id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  </div>
                ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/buy")}
              className="px-8 text-lg group"
            >
              Explore All Properties
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Top Cities
            </h2>
            <p className="text-lg text-muted-foreground">
              Find properties in India's most popular destinations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-[600px]">
            {cityData.map((item) => (
              <div
                key={item.city}
                className={cn(
                  "relative group overflow-hidden rounded-xl cursor-pointer shadow-lg",
                  item.className
                )}
              >
                <img
                  src={item.img}
                  alt={item.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold tracking-wider transform transition-transform duration-300 group-hover:-translate-y-2">
                    {item.city}
                  </h3>
                </div>
              </div>
            ))}
            <div
              key="Pune"
              className="relative group overflow-hidden rounded-xl cursor-pointer shadow-lg md:col-span-2"
            >
              <img
                src="https://thumbs.dreamstime.com/b/shree-swaminarayan-mandir-night-pune-india-view-temple-excellent-newly-built-located-just-down-hill-lot-119574871.jpg"
                alt="Pune"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-3xl font-bold tracking-wider transform transition-transform duration-300 group-hover:-translate-y-2">
                  Pune
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-16 sm:pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore by Property Type
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Home, label: "Apartments" },
              { icon: Building, label: "Villas" },
              { icon: Warehouse, label: "Commercial" },
              { icon: SquareStack, label: "Plots & Land" },
            ].map((type) => (
              <Card
                key={type.label}
                className="group cursor-pointer hover:border-primary hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <type.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {type.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 sm:pt-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Investors Deaal?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner in navigating the real estate landscape.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                desc: "Every property is manually verified for authenticity, ensuring you get exactly what you see.",
              },
              {
                icon: Award,
                title: "Expert Guidance",
                desc: "Receive professional advice from our top real estate consultants at every step of your journey.",
              },
              {
                icon: TrendingUp,
                title: "Market Insights",
                desc: "Access real-time market data and trend analysis to make informed, data-driven decisions.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="text-center bg-background/50 border-border/50 hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="inline-block p-4 bg-primary/10 rounded-full mb-5">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
          </div>
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem
                  key={t.name}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1 h-full">
                    <Card className="h-full bg-muted/40 border-border/20 flex flex-col">
                      <CardContent className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <Quote className="w-10 h-10 text-primary/30 mb-4" />
                          <p className="text-muted-foreground text-base">
                            "{t.quote}"
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/20">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={`https://avatar.iran.liara.run/public?username=${t.name.split("&")[0].trim()}`}
                            />
                            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">
                              {t.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t.city}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      <section className="pb-10 pt-10">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-10 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Property?
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Start your journey with us today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 text-lg"
                  onClick={() => navigate("/buy")}
                >
                  Start Searching
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 text-lg bg-transparent text-white border-white hover:bg-white hover:text-primary transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  Become an Associate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
