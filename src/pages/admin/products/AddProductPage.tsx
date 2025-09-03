import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createProduct,
  resetProductState,
  fetchProducts,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Youtube, PlusCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelect from "react-select";

// Country list
const countries = [
  { value: "India", label: "India" },
  { value: "Mauritius", label: "Mauritius" },
  { value: "South Africa", label: "South Africa" },
  { value: "Canada", label: "Canada" },
  { value: "Kenya", label: "Kenya" },
  { value: "Uganda", label: "Uganda" },
  { value: "Sudan", label: "Sudan" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Libya", label: "Libya" },
  { value: "Liberia", label: "Liberia" },
  { value: "Egypt", label: "Egypt" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Iraq", label: "Iraq" },
  { value: "Oman", label: "Oman" },
  { value: "Iran", label: "Iran" },
  { value: "Botswana", label: "Botswana" },
  { value: "Zambia", label: "Zambia" },
  { value: "Nepal", label: "Nepal" },
  { value: "China", label: "China" },
  { value: "Singapore", label: "Singapore" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Australia", label: "Australia" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Thailand", label: "Thailand" },
  { value: "Italy", label: "Italy" },
  { value: "Brazil", label: "Brazil" },
].sort((a, b) => a.label.localeCompare(b.label));

const AddProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error, products } = useSelector(
    (state: RootState) => state.products
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [planType, setPlanType] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [isSale, setIsSale] = useState<boolean>(false);
  const [crossSell, setCrossSell] = useState<any[]>([]);
  const [upSell, setUpSell] = useState<any[]>([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, products]);

  const productOptions = products.map((p) => ({ value: p._id, label: p.name }));

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        toast.error("You can only upload a maximum of 5 gallery images.");
        e.target.value = "";
        return;
      }
      setGalleryImages(files);
    }
  };

  const handlePlanFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPlanFiles((prev) => [...prev, ...Array.from(e.target.files)]);
      e.target.value = "";
    }
  };

  const handleRemovePlanFile = (indexToRemove: number) => {
    setPlanFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = (data: any) => {
    if (selectedCountries.length === 0 || !propertyType || !planType) {
      toast.error(
        "Please select at least one Country, a Property Type, and a Plan Type."
      );
      return;
    }
    if (!mainImage || planFiles.length === 0) {
      toast.error("Please upload a main image and at least one plan file.");
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    formData.append("country", selectedCountries.map((c) => c.value).join(","));
    formData.append("propertyType", propertyType);
    formData.append("direction", direction);
    formData.append("planType", planType);
    formData.append("isSale", isSale ? "true" : "false");
    formData.append(
      "crossSellProducts",
      crossSell.map((p) => p.value).join(",")
    );
    formData.append("upSellProducts", upSell.map((p) => p.value).join(","));

    if (mainImage) formData.append("mainImage", mainImage);
    if (headerImage) formData.append("headerImage", headerImage);
    galleryImages.forEach((file) => formData.append("galleryImages", file));
    planFiles.forEach((file) => formData.append("planFile", file));

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Product created successfully!");
      dispatch(resetProductState());
      reset();
      setMainImage(null);
      setGalleryImages([]);
      setPlanFiles([]);
      setHeaderImage(null);
      setPropertyType("");
      setDirection("");
      setPlanType("");
      setSelectedCountries([]);
      setIsSale(false);
      setCrossSell([]);
      setUpSell([]);
      navigate("/admin/products");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to create product.");
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch, navigate, reset]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
          <Button
            type="submit"
            className="btn-primary"
            disabled={actionStatus === "loading"}
          >
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Publish Product
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Title*</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Title is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.name.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    rows={8}
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.description.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="youtubeLink">YouTube Video Link</Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="youtubeLink"
                      {...register("youtubeLink")}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="productNo">Product Number*</Label>
                  <Input
                    id="productNo"
                    {...register("productNo", {
                      required: "Product No. is required",
                    })}
                  />
                  {errors.productNo && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.productNo.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    {...register("city", { required: "City is required" })}
                    placeholder="e.g., Mumbai, Delhi"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.city.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plotSize">Plot Size*</Label>
                  <Input
                    id="plotSize"
                    {...register("plotSize", {
                      required: "Plot size is required",
                    })}
                  />
                  {errors.plotSize && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.plotSize.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="plotArea">Plot Area (sqft)*</Label>
                  <Input
                    id="plotArea"
                    type="number"
                    {...register("plotArea", {
                      required: "Plot area is required",
                    })}
                  />
                  {errors.plotArea && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.plotArea.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms (BHK)*</Label>
                  <Input
                    id="rooms"
                    type="number"
                    {...register("rooms", {
                      required: "Rooms count is required",
                    })}
                  />
                  {errors.rooms && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.rooms.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    {...register("bathrooms")}
                  />
                </div>
                <div>
                  <Label htmlFor="kitchen">Kitchen</Label>
                  <Input id="kitchen" type="number" {...register("kitchen")} />
                </div>
                <div>
                  <Label htmlFor="floors">Floors</Label>
                  <Input id="floors" type="number" {...register("floors")} />
                </div>
                <div>
                  <Label>Facing Direction</Label>
                  <Select onValueChange={setDirection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                      <SelectItem value="North-East">North-East</SelectItem>
                      <SelectItem value="North-West">North-West</SelectItem>
                      <SelectItem value="South-East">South-East</SelectItem>
                      <SelectItem value="South-West">South-West</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="country">Country*</Label>
                  <MultiSelect
                    isMulti
                    options={countries}
                    value={selectedCountries}
                    onChange={setSelectedCountries}
                    className="mt-1"
                    classNamePrefix="select"
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO & Marketing</CardTitle>
                <CardDescription>
                  Optimize visibility and relationships.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    {...register("seoTitle")}
                    placeholder="A catchy title for search engines"
                  />
                </div>
                <div>
                  <Label htmlFor="seoAltText">Main Image Alt Text</Label>
                  <Input
                    id="seoAltText"
                    {...register("seoAltText")}
                    placeholder="Describe the main image for SEO"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    rows={3}
                    {...register("seoDescription")}
                    placeholder="A brief summary for search engines"
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    {...register("seoKeywords")}
                    placeholder="Comma-separated, e.g., house plan, 3bhk"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label htmlFor="crossSellProducts">
                      Cross-Sell Products
                    </Label>
                    <MultiSelect
                      isMulti
                      options={productOptions}
                      value={crossSell}
                      onChange={setCrossSell}
                      className="mt-1"
                      classNamePrefix="select"
                      placeholder="Select related products..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="upSellProducts">Up-Sell Products</Label>
                    <MultiSelect
                      isMulti
                      options={productOptions}
                      value={upSell}
                      onChange={setUpSell}
                      className="mt-1"
                      classNamePrefix="select"
                      placeholder="Select premium alternatives..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {planType === "Construction Products" && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input id="contactName" {...register("contactName")} />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      {...register("contactPhone")}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Upload main image, gallery, header, and plan files.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mainImage">Main Image*</Label>
                  <Input
                    id="mainImage"
                    type="file"
                    onChange={(e) =>
                      setMainImage(e.target.files ? e.target.files[0] : null)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="galleryImages">
                    Gallery Images (Up to 5)
                  </Label>
                  <Input
                    id="galleryImages"
                    type="file"
                    multiple
                    onChange={handleGalleryImagesChange}
                  />
                </div>
                <div>
                  <Label htmlFor="headerImage">Downloadable Header Image</Label>
                  <Input
                    id="headerImage"
                    type="file"
                    onChange={(e) =>
                      setHeaderImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="planFileInput">Plan Files*</Label>
                  <Input
                    id="planFileInput"
                    type="file"
                    multiple
                    onChange={handlePlanFilesChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("planFileInput")?.click()
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Files
                  </Button>
                  <div className="mt-2 space-y-2">
                    {planFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                      >
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePlanFile(index)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Tax</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (₹)*</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.price.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    {...register("salePrice")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountPercentage">Discount (%)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      {...register("discountPercentage")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      {...register("taxRate")}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isSale"
                    checked={isSale}
                    onCheckedChange={(checked) => setIsSale(checked === true)}
                  />
                  <Label htmlFor="isSale">This product is on sale</Label>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Plan Type*</Label>
                  <Select onValueChange={setPlanType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Plan Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Floor Plans">Floor Plans</SelectItem>
                      <SelectItem value="Floor Plan + 3D Elevations">
                        Floor Plans + 3D Elevations
                      </SelectItem>
                      <SelectItem value="Interior Designs">
                        Interior Designs
                      </SelectItem>
                      <SelectItem value="Construction Products">
                        Construction Products
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category*</Label>
                  <Input
                    id="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.category.message)}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Property Type*</Label>
                  <Select onValueChange={setPropertyType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
