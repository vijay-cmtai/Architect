import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchProductById,
  updateProduct,
  resetProductState,
} from "@/lib/features/products/productSlice"; // Adjust path if needed

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
import { UploadCloud, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listStatus, actionStatus, error } = useSelector(
    (state: any) => state.products
  );
  const productId = product?._id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState(null);
  const [planFile, setPlanFile] = useState(null);
  const [propertyType, setPropertyType] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [status, setStatus] = useState("");

  // Fetch product data when component mounts
  useEffect(() => {
    if (!isOpen) return;
    if (productId) {
      (dispatch as any)(fetchProductById(productId));
    }
    return () => {
      dispatch(resetProductState());
    };
  }, [productId, dispatch, isOpen]);

  // Pre-fill form once product data is loaded
  useEffect(() => {
    if (product) {
      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });
      setPropertyType(product.propertyType || "");
      setIsSale(product.isSale || false);
      setStatus(product.status || "");
    }
  }, [product, setValue]);

  // Handle form submission
  const onSubmit = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("propertyType", propertyType);
    formData.append("isSale", isSale ? "true" : "false");
    formData.append("status", status); // Include status for admin updates

    if (image) formData.append("image", image);
    if (planFile) formData.append("planFile", planFile);

    (dispatch as any)(updateProduct({ productId, productData: formData }));
  };

  // Handle success/error after dispatch
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Product updated successfully!");
      dispatch(resetProductState());
      onClose();
      navigate("/admin/products");
    }
    if (actionStatus === "failed") {
      toast.error(error || "Failed to update product.");
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch, navigate, onClose]);

  if (listStatus === "loading") {
    return (
      <div className="text-center p-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (listStatus === "failed" && !product) {
    return (
      <div className="text-center p-12 text-red-500">
        Error: Could not load product data.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        <Button
          type="submit"
          className="btn-primary"
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Update Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Plan Title</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Title is required" })}
                />
                {errors.name && typeof errors.name.message === "string" && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={8}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description &&
                  typeof errors.description.message === "string" && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Plan Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="plotSize">Plot Size</Label>
                <Input
                  id="plotSize"
                  {...register("plotSize", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="plotArea">Plot Area (sqft)</Label>
                <Input
                  id="plotArea"
                  type="number"
                  {...register("plotArea", { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="rooms">Rooms (BHK)</Label>
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Update Images & Files</CardTitle>
              <CardDescription>
                Only upload new files if you want to replace the existing ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="image">Replace Main Image</Label>
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-1"
                />
                {product?.image && !image && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current:{" "}
                    <a
                      href={product.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      View Image
                    </a>
                  </p>
                )}
                {image && (
                  <p className="text-xs text-gray-500 mt-2">
                    New: {image.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="planFile">Replace Plan File</Label>
                <Input
                  id="planFile"
                  type="file"
                  onChange={(e) => setPlanFile(e.target.files[0])}
                  className="mt-1"
                />
                {product?.planFile && !planFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current:{" "}
                    <a
                      href={product.planFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      View File
                    </a>
                  </p>
                )}
                {planFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    New: {planFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Regular Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && typeof errors.price.message === "string" && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.price.message}
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
                <Label>Category</Label>
                <Input
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                />
                {errors.category &&
                  typeof errors.category.message === "string" && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
              </div>
              <div>
                <Label>Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Pending Review">
                      Pending Review
                    </SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default EditProductModal;
