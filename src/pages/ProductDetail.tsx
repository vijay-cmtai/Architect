import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, Star, ArrowLeft, Share2, CheckCircle, Truck, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import house1 from '@/assets/house-1.jpg';
import house2 from '@/assets/house-2.jpg';
import house3 from '@/assets/house-3.jpg';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  // Mock product data - in real app, fetch based on id
  const product = {
    id: id || '1',
    name: 'Modern Minimalist Villa',
    size: '3BHK - 2400 sqft',
    price: 89999,
    images: [house1, house2, house3],
    rating: 4.8,
    reviews: 124,
    description: 'This stunning modern minimalist villa combines contemporary design with functional living spaces. Perfect for families who appreciate clean lines, open concepts, and seamless indoor-outdoor living.',
    specifications: {
      plotSize: '2400 sq ft',
      builtUpArea: '1800 sq ft',
      bedrooms: 3,
      bathrooms: 3,
      style: 'Modern Minimalist',
      vastuCompliant: 'Yes'
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: product.size
      });
    }
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Added to Cart!",
      description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
    });
    
    setIsAddingToCart(false);
    
    // Optional: Navigate to cart after adding
    setTimeout(() => {
      const shouldGoToCart = window.confirm("Would you like to view your cart?");
      if (shouldGoToCart) {
        navigate('/cart');
      }
    }, 1000);
  };

  const relatedProducts = [
    {
      id: '2',
      name: 'Contemporary Family Home',
      size: '4BHK - 3200 sqft',
      price: 124999,
      image: house2
    },
    {
      id: '3',
      name: 'Luxury Mediterranean Villa',
      size: '5BHK - 4500 sqft',
      price: 199999,
      image: house3
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-gray mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-primary-gray">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Button variant="outline" asChild className="mb-6">
          <Link to="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-large group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-gray hover:text-accent transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Share2 className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary-gray">
                {selectedImage + 1} / {product.images.length}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedImage === index 
                      ? 'ring-2 ring-primary shadow-orange' 
                      : 'hover:ring-2 hover:ring-primary/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-24 object-cover transition-transform duration-300"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-primary/10"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                <CheckCircle className="w-4 h-4 mr-1" />
                In Stock
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-gray mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-secondary-gray font-medium">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-4xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </div>
                <div className="text-lg text-secondary-gray line-through">
                  ₹{(product.price * 1.2).toLocaleString()}
                </div>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                  17% OFF
                </div>
              </div>

              <p className="text-secondary-gray text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Quick Features */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-soft-teal rounded-xl">
                  <Truck className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary-gray">Fast Delivery</p>
                  <p className="text-xs text-secondary-gray">Instant Download</p>
                </div>
                <div className="text-center p-4 bg-soft-teal rounded-xl">
                  <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary-gray">Secure</p>
                  <p className="text-xs text-secondary-gray">SSL Protected</p>
                </div>
                <div className="text-center p-4 bg-soft-teal rounded-xl">
                  <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium text-primary-gray">Premium</p>
                  <p className="text-xs text-secondary-gray">High Quality</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-soft-teal to-white rounded-2xl p-6 border border-accent/10">
              <h3 className="text-lg font-semibold text-primary-gray mb-4 flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Plot Size</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.plotSize}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Built-up Area</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.builtUpArea}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Bedrooms</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.bedrooms}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Bathrooms</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.bathrooms}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Style</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.style}</span>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <span className="text-secondary-gray text-sm">Vastu Compliant</span>
                  <span className="block font-semibold text-primary-gray text-lg">{product.specifications.vastuCompliant}</span>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-primary-gray font-medium">Quantity:</span>
                <div className="flex items-center border-2 border-primary/20 rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-primary/5 transition-colors rounded-l-lg text-primary"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 border-x border-primary/20 font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-primary/5 transition-colors rounded-r-lg text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-secondary-gray">
                  Total: ₹{(product.price * quantity).toLocaleString()}
                </span>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleAddToCart} 
                  disabled={isAddingToCart}
                  className="flex-1 btn-primary py-4 text-lg relative overflow-hidden group"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      Add to Cart
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`w-14 h-14 transition-all duration-300 ${
                    isLiked ? 'bg-red-50 border-red-300 text-red-500' : 'hover:bg-primary/5 hover:border-primary'
                  }`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-6 h-6 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
                </Button>
              </div>
              
              {/* Buy Now Button */}
              <Button 
                variant="outline" 
                className="w-full py-4 text-lg font-semibold border-2 border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => navigate('/checkout')}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
            <TabsTrigger value="3dviews">3D Views</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-8">
            <div className="prose max-w-none">
              <p className="text-secondary-gray leading-relaxed">
                {product.description} This design maximizes natural light and ventilation while maintaining privacy and comfort. 
                The open-plan living areas create a sense of spaciousness, while carefully planned zones ensure functionality for daily life.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="floorplan" className="mt-8">
            <div className="bg-soft-teal rounded-2xl p-8 text-center">
              <p className="text-secondary-gray">Floor plan images would be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="3dviews" className="mt-8">
            <div className="bg-soft-teal rounded-2xl p-8 text-center">
              <p className="text-secondary-gray">3D visualization renders would be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">John Doe</span>
                  <span className="ml-auto text-sm text-secondary-gray">2 days ago</span>
                </div>
                <p className="text-secondary-gray">
                  Excellent design! The layout is perfect for our family needs. Highly recommended.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-primary-gray mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="card-product group">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 rounded-t-2xl"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-primary-gray mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-secondary-gray mb-3">{relatedProduct.size}</p>
                  <div className="text-xl font-bold text-primary">
                    ₹{relatedProduct.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;