import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  createPlan,
  resetPlanActionStatus,
} from "@/lib/features/professional/professionalPlanSlice";

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
import { Loader2, ShieldAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
].sort();

const AddPlanPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { actionStatus, error } = useSelector(
    (state: RootState) => state.professionalPlans
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

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
    if (!userInfo || userInfo.role !== "professional" || !userInfo.isApproved) {
      toast.error("You are not authorized to perform this action.");
      return;
    }
    if (!planType || !country || !propertyType) {
      toast.error("Please select a Plan Type, Property Type, and Country.");
      return;
    }
    if (!mainImage || !planFile) {
      toast.error("Please upload both a main image and the plan file.");
      return;
    }

    const formData = new FormData();
    // react-hook-form से सभी डेटा को जोड़ें (इसमें youtubeLink भी शामिल होगा)
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        // Sirf non-empty values ko append karein
        formData.append(key, data[key]);
      }
    });

    formData.append("planName", data.name);
    formData.append("propertyType", propertyType);
    formData.append("direction", direction);
    formData.append("planType", planType);
    formData.append("country", country);
    formData.append("isSale", isSale ? "true" : "false");

    if (mainImage) formData.append("mainImage", mainImage);
    if (planFile) formData.append("planFile", planFile);
    if (galleryImages.length > 0) {
      galleryImages.forEach((file) => formData.append("galleryImages", file));
    }

    dispatch(createPlan(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Plan submitted for review successfully!");
      dispatch(resetPlanActionStatus());
      reset();
      setMainImage(null);
      setPlanFile(null);
      setGalleryImages([]);
      setPropertyType("");
      setDirection("");
      setPlanType("");
      setCountry("");
      setIsSale(false);
      navigate("/professional/my-products");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to create plan.");
      dispatch(resetPlanActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate, reset]);

  if (userInfo && userInfo.role === "professional" && !userInfo.isApproved) {
    return (
      <div className="container mx-auto px-4 py-8 text-center flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg mx-auto p-8">
          <ShieldAlert className="mx-auto h-12 w-12 text-yellow-500" />
          <CardHeader>
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              You cannot add new plans until your account has been approved by
              an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please check back later or contact support if you believe this is
              an error.
            </p>
            <Link to="/professional">
              <Button variant="outline" className="mt-6">
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Add New Plan</h1>
          <Button
            type="submit"
            className="btn-primary"
            disabled={actionStatus === "loading"}
          >
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit for Review
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Title*</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 4BHK Vastu Compliant Plan"
                    {...register("name", {
                      required: "Plan title is required",
                    })}
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
                    placeholder="Describe the plan features, area, style..."
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Plan Specifications</CardTitle>
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
                      {countries.map((c) => (
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

            {/* ========================================================== */}
            {/* ✨ NAYA CARD: YouTube Link ke liye ✨ */}
            {/* ========================================================== */}
            <Card>
              <CardHeader>
                <CardTitle>YouTube Link</CardTitle>
                <CardDescription>
                  Optional: Add a link to a YouTube video of the plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="youtubeLink">Video URL</Label>
                  <Input
                    id="youtubeLink"
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...register("youtubeLink", {
                      // Basic URL validation
                      pattern: {
                        value:
                          /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
                        message: "Please enter a valid URL",
                      },
                    })}
                  />
                  {errors.youtubeLink && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(errors.youtubeLink.message)}
                    </p>
                  )}
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
                  <Label htmlFor="isSale">This plan is on sale</Label>
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

export default AddPlanPage;
