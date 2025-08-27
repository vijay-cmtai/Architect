import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  createProduct,
  resetProductState,
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
import { Loader2, Youtube } from "lucide-react"; // Youtube icon import karein
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// ✨ YAHAN BADLAAV HAI: "India" ko list mein add kiya gaya hai ✨
const countries = [
  "India",
  "Mauritius",
  "South Africa",
  "Canada",
  "Kenya",
  "Uganda",
  "Sudan",
  "Nigeria",
  "Libya",
  "Liberia",
  "Egypt",
  "Germany",
  "France",
  "United Kingdom",
  "Iraq",
  "Oman",
  "Iran",
  "Botswana",
  "Zambia",
  "Nepal",
  "China",
  "Singapore",
  "Indonesia",
  "Australia",
  "Vietnam",
  "Thailand",
  "Italy",
  "Brazil",
];

const AddProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector(
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
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [planType, setPlanType] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isSale, setIsSale] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    if (!propertyType || !planType || !country) {
      toast.error("Please select a Property Type, Plan Type, and Country.");
      return;
    }
    if (!mainImage || !planFile) {
      toast.error("Please upload both a main image and the plan file.");
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    formData.append("propertyType", propertyType);
    formData.append("direction", direction);
    formData.append("planType", planType);
    formData.append("country", country);
    formData.append("isSale", isSale ? "true" : "false");

    if (mainImage) formData.append("mainImage", mainImage);
    if (planFile) formData.append("planFile", planFile);
    if (galleryImages.length > 0) {
      galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });
    }

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Product created and published successfully!");
      dispatch(resetProductState());
      reset();
      setMainImage(null);
      setPlanFile(null);
      setGalleryImages([]);
      setPropertyType("");
      setDirection("");
      setPlanType("");
      setCountry("");
      setIsSale(false);
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
                    placeholder="e.g., Modern 4-Bedroom Villa"
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
                    placeholder="Describe the product features..."
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
                {/* ✨ YAHAN BADLAAV HAI: YouTube Link ka field add kiya gaya hai ✨ */}
                <div>
                  <Label htmlFor="youtubeLink">
                    YouTube Video Link (Optional)
                  </Label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="youtubeLink"
                      placeholder="https://www.youtube.com/watch?v=..."
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
                  <Label htmlFor="plotSize">Plot Size*</Label>
                  <Input
                    id="plotSize"
                    placeholder="e.g., 30x40"
                    {...register("plotSize", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="plotArea">Plot Area (sqft)*</Label>
                  <Input
                    id="plotArea"
                    type="number"
                    {...register("plotArea", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="rooms">Rooms (BHK)*</Label>
                  <Input
                    id="rooms"
                    type="number"
                    {...register("rooms", { required: true })}
                  />
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
                <div>
                  <Label htmlFor="country">Country*</Label>
                  <Select onValueChange={setCountry} required>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.sort().map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Upload main image, gallery images, and plan file.
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
                    onChange={(e) =>
                      setGalleryImages(
                        e.target.files ? Array.from(e.target.files) : []
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="planFile">Plan File*</Label>
                  <Input
                    id="planFile"
                    type="file"
                    onChange={(e) =>
                      setPlanFile(e.target.files ? e.target.files[0] : null)
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Price (₹)*</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    {...register("salePrice")}
                  />
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
                      <SelectItem value="3D Elevations">
                        3D Elevations
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
                    placeholder="e.g., House Plan"
                    {...register("category", { required: true })}
                  />
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
