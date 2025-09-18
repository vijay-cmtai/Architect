import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchProducts,
  createReview as createProductReview,
  fetchProductById,
} from "@/lib/features/products/productSlice";
import {
  fetchAllApprovedPlans,
  createPlanReview,
} from "@/lib/features/professional/professionalPlanSlice";
import {
  Heart,
  Plus,
  Minus,
  Loader2,
  ServerCrash,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  AtSign,
  MessageSquare,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import house1 from "@/assets/house-1.jpg";

// --- Icono SVG personalizado para Pinterest ---
const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />
  </svg>
);

// Helper component para mostrar estrellas de rating
const StarRating = ({ rating, text }: { rating: number; text?: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
);

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  const isProfessionalPlan = location.pathname.includes("/professional-plan/");

  const {
    products: adminProducts,
    product: singleProduct,
    listStatus: adminListStatus,
    actionStatus: adminActionStatus,
  } = useSelector((state: RootState) => state.products);
  const {
    plans: professionalPlans,
    listStatus: profListStatus,
    actionStatus: profActionStatus,
  } = useSelector((state: RootState) => state.professionalPlans);
  const { userInfo } = useSelector((state: RootState) => state.user);

  const { state: cartState, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const displayData = isProfessionalPlan
    ? professionalPlans.find((p) => p._id === id)
    : singleProduct;

  useEffect(() => {
    if (id) {
      if (isProfessionalPlan) {
        // Professional plan fetch logic would be here if needed
      } else {
        dispatch(fetchProductById(id));
      }
    }
  }, [id, dispatch, isProfessionalPlan]);

  const productImages = useMemo(() => {
    if (!displayData) return [house1];
    const images = [
      displayData.mainImage,
      ...(displayData.galleryImages || []),
    ].filter(Boolean);
    return images.length > 0 ? images : [house1];
  }, [displayData]);

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(displayData?.name || "");
  const encodedImage = encodeURIComponent(productImages[selectedImageIndex]);

  const socialPlatforms = [
    {
      name: "Facebook",
      icon: <Facebook size={20} />,
      color: "bg-blue-800",
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
      color: "bg-sky-700",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Pinterest",
      icon: <PinterestIcon />,
      color: "bg-red-600",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    },
    {
      name: "Telegram",
      icon: <Send size={20} />,
      color: "bg-sky-400",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    { name: "Koo", icon: <AtSign size={20} />, color: "bg-black", href: "#" },
  ];

  const handleAddToCart = async () => {
    if (!displayData) return;
    await addItem({
      productId: displayData._id,
      name: displayData.name,
      price: displayData.isSale ? displayData.salePrice : displayData.price,
      image: productImages[0],
      size: displayData.plotSize,
      quantity: quantity,
    });
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${displayData.name} has been added to your cart.`,
    });
    setTimeout(() => {
      if (
        window.confirm("Item added to cart. Would you like to view your cart?")
      ) {
        navigate("/cart");
      }
    }, 500);
  };

  const handleBuyNow = async () => {
    if (!displayData) return;
    await addItem({
      productId: displayData._id,
      name: displayData.name,
      price: displayData.isSale ? displayData.salePrice : displayData.price,
      image: productImages[0],
      size: displayData.plotSize,
      quantity: quantity,
    });
    navigate("/checkout");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast({
        title: "Error",
        description: "Please provide a rating and a comment.",
        variant: "destructive",
      });
      return;
    }
    const reviewAction = isProfessionalPlan
      ? createPlanReview({ planId: id!, reviewData: { rating, comment } })
      : createProductReview({
          productId: id!,
          reviewData: { rating, comment },
        });
    dispatch(reviewAction)
      .unwrap()
      .then(() => {
        toast({
          title: "Success",
          description: "Review submitted successfully!",
        });
        setRating(0);
        setComment("");
        if (isProfessionalPlan) {
          dispatch(fetchAllApprovedPlans());
        } else {
          dispatch(fetchProductById(id!));
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err as string,
          variant: "destructive",
        });
      });
  };

  const relatedProducts = useMemo(() => {
    if (!displayData) return [];
    const allItems = [
      ...(Array.isArray(adminProducts)
        ? adminProducts.map((p) => ({
            ...p,
            name: p.name,
            image: p.mainImage,
            source: "product",
          }))
        : []),
      ...(Array.isArray(professionalPlans)
        ? professionalPlans.map((p) => ({
            ...p,
            name: p.planName,
            image: p.mainImage,
            source: "professional",
          }))
        : []),
    ];
    return allItems
      .filter((p: any) => p.category === displayData.category && p._id !== id)
      .slice(0, 2);
  }, [adminProducts, professionalPlans, displayData, id]);

  const isLoading =
    (adminListStatus === "loading" && !singleProduct) ||
    (profListStatus === "loading" && !isProfessionalPlan);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Product Not Found</title>
        </Helmet>
        <Navbar />
        <div className="text-center py-20">
          <ServerCrash className="mx-auto h-16 w-16 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Item Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The item you are looking for does not exist.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = displayData.isSale
    ? displayData.salePrice
    : displayData.price;
  const originalPrice = displayData.price;
  const actionStatus = isProfessionalPlan
    ? profActionStatus
    : adminActionStatus;
  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          {displayData.seo?.title || `${displayData.name} | House Plan Files`}
        </title>
        <meta
          name="description"
          content={
            displayData.seo?.description ||
            displayData.description.substring(0, 160)
          }
        />
        <meta name="keywords" content={displayData.seo?.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content={displayData.seo?.title || displayData.name}
        />
        <meta
          property="og:description"
          content={
            displayData.seo?.description ||
            displayData.description.substring(0, 160)
          }
        />
        <meta property="og:image" content={displayData.mainImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={String(currentPrice)} />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={displayData.seo?.title || displayData.name}
        />
        <meta
          name="twitter:description"
          content={
            displayData.seo?.description ||
            displayData.description.substring(0, 160)
          }
        />
        <meta name="twitter:image" content={displayData.mainImage} />
      </Helmet>

      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link
            to={isProfessionalPlan ? "/professional-plans" : "/products"}
            className="hover:text-primary"
          >
            {isProfessionalPlan ? "Professional Plans" : "Products"}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{displayData.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group bg-gray-100">
              <img
                src={productImages[selectedImageIndex]}
                alt={displayData.seo?.altText || displayData.name}
                className="w-full h-96 lg:h-[500px] object-contain transition-transform duration-500 group-hover:scale-105"
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
                    alt={`${displayData.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {displayData.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <StarRating
                  rating={displayData.rating || 0}
                  text={`${displayData.numReviews || 0} reviews`}
                />
              </div>
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-4xl font-bold text-primary">
                  ₹{currentPrice?.toLocaleString()}
                </div>
                {displayData.isSale && (
                  <div className="text-lg text-gray-500 line-through">
                    ₹{originalPrice?.toLocaleString()}
                  </div>
                )}
              </div>
              <div
                className="text-gray-600 text-lg leading-relaxed mb-6 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    displayData.description || "No description available.",
                }}
              />
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Plot Size:</span>{" "}
                  {displayData.plotSize}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Plot Area:</span>{" "}
                  {displayData.plotArea} sqft
                </div>
                <div>
                  <span className="font-medium text-gray-600">Rooms:</span>{" "}
                  {displayData.rooms} BHK
                </div>
                <div>
                  <span className="font-medium text-gray-600">Bathrooms:</span>{" "}
                  {displayData.bathrooms}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Kitchen:</span>{" "}
                  {displayData.kitchen}
                </div>
                <div>
                  <span className="font-medium text-gray-600">Direction:</span>{" "}
                  {displayData.direction}
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
                <span className="font-medium text-gray-800">Quantity:</span>
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
        <div className="border-t pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Customer Reviews
              </h2>
              {displayData.reviews && displayData.reviews.length > 0 ? (
                <div className="space-y-6">
                  {displayData.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          {review.name}
                        </h3>
                        <StarRating rating={review.rating} text="" />
                      </div>
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Write a Review
              </h2>
              {userInfo ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="space-y-4 bg-gray-50 p-6 rounded-lg border"
                >
                  <div>
                    <label className="font-semibold text-gray-700">
                      Your Rating
                    </label>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="font-semibold text-gray-700"
                    >
                      Your Comment
                    </label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this plan..."
                      className="mt-2"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={actionStatus === "loading"}
                  >
                    {actionStatus === "loading" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </form>
              ) : (
                <p className="text-gray-600">
                  Please{" "}
                  <Link to="/login" className="text-primary underline">
                    log in
                  </Link>{" "}
                  to write a review.
                </p>
              )}
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <div className="border-t pt-16 mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProducts.map((relatedProd: any) => (
                <Link
                  key={relatedProd._id}
                  to={
                    relatedProd.source === "professional"
                      ? `/professional-plan/${relatedProd._id}`
                      : `/product/${relatedProd._id}`
                  }
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
                      ₹{relatedProd.price?.toLocaleString()}
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

export default DetailPage;
