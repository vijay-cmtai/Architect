import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import {
  Heart,
  Plus,
  Minus,
  Loader2,
  ServerCrash,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import house1 from "@/assets/house-1.jpg";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const { products: adminProducts, listStatus: adminListStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { plans: professionalPlans, listStatus: profListStatus } = useSelector(
    (state: RootState) => state.professionalPlans
  );

  const { state: cartState, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (adminListStatus === "idle") {
      dispatch(fetchProducts({}));
    }
    if (profListStatus === "idle") {
      dispatch(fetchAllApprovedPlans());
    }
  }, [dispatch, adminListStatus, profListStatus]);

  const product = useMemo(() => {
    const allProducts = [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({ ...p, name: p.name, image: p.mainImage }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({
            ...p,
            name: p.planName,
            image: p.mainImage,
          }))
        : []),
    ];
    return allProducts.find((p) => p._id === id) || null;
  }, [adminProducts, professionalPlans, id]);

  const productImages = useMemo(() => {
    if (!product) return [house1];
    const images = [product.image, ...(product.galleryImages || [])].filter(
      Boolean
    );
    return images.length > 0 ? images : [house1];
  }, [product]);

  // --- Social Share Logic ---
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(product?.name || "");
  const encodedImage = encodeURIComponent(productImages[selectedImageIndex]);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      color: "bg-blue-600",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageSquare size={20} />,
      color: "bg-green-500",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      color: "bg-sky-500",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      color: "bg-blue-700",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Instagram",
      icon: <Instagram size={20} />,
      color: "bg-gradient-to-br from-purple-400 via-pink-500 to-yellow-500",
      href: `https://www.instagram.com`,
    },
  ];
  // --- End of Social Share Logic ---

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem({
      productId: product._id,
      name: product.name,
      price: product.isSale ? product.salePrice : product.price,
      image: productImages[0],
      size: product.plotSize,
      quantity: quantity,
    });
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
    setTimeout(() => {
      const shouldGoToCart = window.confirm(
        "Item added to cart. Would you like to view your cart?"
      );
      if (shouldGoToCart) {
        navigate("/cart");
      }
    }, 500);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addItem({
      productId: product._id,
      name: product.name,
      price: product.isSale ? product.salePrice : product.price,
      image: productImages[0],
      size: product.plotSize,
      quantity: quantity,
    });
    navigate("/checkout");
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const allProducts = [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({ ...p, name: p.name, image: p.mainImage }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({
            ...p,
            name: p.planName,
            image: p.mainImage,
          }))
        : []),
    ];
    return allProducts
      .filter((p: any) => p.category === product.category && p._id !== id)
      .slice(0, 2);
  }, [adminProducts, professionalPlans, product, id]);

  const isLoading =
    adminListStatus === "loading" || profListStatus === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <ServerCrash className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Product Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The product you are looking for does not exist.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = product.isSale ? product.salePrice : product.price;
  const originalPrice = product.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transform scale-125 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg ${selectedImageIndex === index ? "ring-2 ring-primary" : ""}`}
                  type="button"
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-4xl font-bold text-primary">
                  ₹{currentPrice?.toLocaleString()}
                </div>
                {product.isSale && (
                  <div className="text-lg text-gray-500 line-through">
                    ₹{originalPrice?.toLocaleString()}
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description || "No description available."}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Plot Size:</span>{" "}
                  {product.plotSize}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Plot Area:</span>{" "}
                  {product.plotArea} sqft
                </div>
                <div>
                  <span className="font-medium text-gray-600">Rooms:</span>{" "}
                  {product.rooms || product.bhk} BHK
                </div>
                <div>
                  <span className="font-medium text-gray-600">Bathrooms:</span>{" "}
                  {product.bathrooms}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Kitchen:</span>{" "}
                  {product.kitchen}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Direction:</span>{" "}
                  {product.direction}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Share to
              </h3>
              <div className="flex items-center gap-2">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Share on ${platform.name}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${platform.color} transition-opacity hover:opacity-80`}
                  >
                    {platform.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-800 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={cartState.loading}
                    variant="outline"
                    className="flex-1 py-4 text-lg"
                  >
                    {cartState.loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Adding...
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-14 h-14"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? "fill-current text-red-500" : ""}`}
                    />
                  </Button>
                </div>
                <Button
                  onClick={handleBuyNow}
                  disabled={cartState.loading}
                  className="w-full py-4 text-lg"
                >
                  {cartState.loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProducts.map((relatedProd: any) => (
                <Link
                  key={relatedProd._id}
                  to={`/product/${relatedProd._id}`}
                  className="group block bg-white rounded-lg shadow hover:shadow-lg"
                >
                  <img
                    src={relatedProd.mainImage || relatedProd.image || house1}
                    alt={relatedProd.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedProd.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{relatedProd.plotSize}</p>
                    <div className="text-xl font-bold text-primary">
                      ₹
                      {(relatedProd.isSale
                        ? relatedProd.salePrice
                        : relatedProd.price
                      )?.toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
