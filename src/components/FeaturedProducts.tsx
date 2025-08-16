import { Link } from "react-router-dom";
import { Eye, Heart, Youtube, Star } from "lucide-react"; // Star icon ko import karein
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import house1 from "@/assets/house-1.jpg";
import house2 from "@/assets/house-2.jpg";
import house3 from "@/assets/house-3.jpg";

const FeaturedProducts = () => {
  // Data ko naye design ke anusaar update kiya gaya hai
  const products = [
    {
      id: "1",
      name: "Modern Minimalist Villa",
      size: "3BHK - 2400 sqft",
      price: 99999,
      salePrice: 89999,
      image: house1,
      rating: 4.8,
      reviews: 124,
      isSale: true,
      hasVideo: true,
      youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_1",
    },
    {
      id: "2",
      name: "Contemporary Family Home",
      size: "4BHK - 3200 sqft",
      price: 124999,
      image: house2,
      rating: 4.9,
      reviews: 89,
      isSale: false,
      hasVideo: false,
    },
    {
      id: "3",
      name: "Luxury Mediterranean Villa",
      size: "5BHK - 4500 sqft",
      price: 219999,
      salePrice: 199999,
      image: house3,
      rating: 4.7,
      reviews: 156,
      isSale: true,
      hasVideo: false,
    },
    {
      id: "4",
      name: "Eco-Friendly Smart Home",
      size: "3BHK - 2800 sqft",
      price: 109999,
      image: house1,
      rating: 4.8,
      reviews: 98,
      isSale: false,
      hasVideo: false,
    },
    {
      id: "5",
      name: "Classic Colonial Style",
      size: "4BHK - 3600 sqft",
      price: 149999,
      image: house2,
      rating: 4.6,
      reviews: 67,
      isSale: false,
      hasVideo: false,
    },
    {
      id: "6",
      name: "Modern Townhouse",
      size: "2BHK - 1800 sqft",
      price: 89999,
      salePrice: 69999,
      image: house3,
      rating: 4.9,
      reviews: 203,
      isSale: true,
      hasVideo: true,
      youtubeLink: "https://www.youtube.com/watch?v=VIDEO_ID_HERE_2",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured House Plans
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and award-winning architectural designs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-card rounded-2xl shadow-soft overflow-hidden group transition-all duration-300 hover:shadow-medium hover:-translate-y-2 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* --- SALE & YOUTUBE BADGE (TOP LEFT) --- */}
                {product.isSale &&
                  (product.hasVideo && product.youtubeLink ? (
                    <a
                      href={product.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 hover:bg-red-600 transition-colors"
                    >
                      <span>Sale!</span>
                      <Youtube size={14} />
                    </a>
                  ) : (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                      <span>Sale!</span>
                    </div>
                  ))}

                {/* --- HEART & EYE ICONS (TOP RIGHT) --- */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-sm">
                    <Heart className="w-5 h-5" />
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-foreground hover:text-primary transition-colors shadow-sm"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>

                {/* --- STAR RATING (BOTTOM OF IMAGE) --- */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md flex items-center gap-1.5 text-xs font-semibold">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.size}
                </p>

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      ₹
                      {product.isSale
                        ? product.salePrice.toLocaleString()
                        : product.price.toLocaleString()}
                    </span>
                    {product.isSale && (
                      <s className="text-sm text-muted-foreground">
                        ₹{product.price.toLocaleString()}
                      </s>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.reviews} reviews
                  </span>
                </div>

                <div className="mt-auto">
                  <Link to={`/product/${product.id}`}>
                    <Button className="w-full btn-primary text-base">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
