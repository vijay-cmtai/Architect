// src/pages/ProductDetail.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice"; 
import { Heart, Plus, Minus, Loader2, ServerCrash } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner"; // sonner का उपयोग करें
import house1 from "@/assets/house-1.jpg";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // ✨ दोनों स्लाइस से डेटा get करें ✨
  const { products: adminProducts, listStatus: adminListStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { plans: professionalPlans, listStatus: profListStatus } = useSelector(
    (state: RootState) => state.professionalPlans
  );

  const { state: cartState, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // अगर डेटा पहले से लोड नहीं है, तो दोनों को fetch करें
    if (adminListStatus === "idle") {
      dispatch(fetchProducts({}));
    }
    if (profListStatus === "idle") {
      dispatch(fetchAllApprovedPlans());
    }
  }, [dispatch, adminListStatus, profListStatus]);

  // ✨ FIX: दोनों लिस्ट में प्रोडक्ट/प्लान को ढूंढें ✨
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
    const images = [product.mainImage, ...(product.galleryImages || [])].filter(
      Boolean
    );
    return images.length > 0 ? images : [house1];
  }, [product]);

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
    toast.success(`${quantity} x ${product.name} added to cart!`);
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
      <div className="min-h-screen">
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
                className="w-full h-96 lg:h-[500px] object-cover"
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
        {/* Related products can be added here */}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
