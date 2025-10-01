import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MultiSelect as MultiSelectForProducts } from "@/components/ui/MultiSelectDropdown";
import {
  updateProduct,
  fetchProducts,
  Product,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";
import {
  Loader2,
  Youtube,
  ChevronsUpDown,
  PlusCircle,
  XCircle,
} from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface IProductFormData {
  name: string;
  description: string;
  youtubeLink?: string;
  productNo: string;
  city: string;
  plotSize: string;
  plotArea: number;
  rooms: number;
  bathrooms?: number;
  kitchen?: number;
  floors?: number;
  seoTitle?: string;
  seoAltText?: string;
  seoDescription?: string;
  seoKeywords?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  price: number;
  salePrice?: number;
  taxRate?: number;
  category: string;
}

interface MultiSelectCountryProps {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  options: { value: string; label: string }[];
  placeholder: string;
}

// Static Data
const countries = [
  { value: "India", label: "India" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Nepal", label: "Nepal" },
  { value: "Myanmar", label: "Myanmar" },
  { value: "Afghanistan", label: "Afghanistan" },
  { value: "Iran", label: "Iran" },
  { value: "Oman", label: "Oman" },
  { value: "Tajikistan", label: "Tajikistan" },
  { value: "Turkmenistan", label: "Turkmenistan" },
  { value: "Kuwait", label: "Kuwait" },
  { value: "Bahrain", label: "Bahrain" },
  { value: "Qatar", label: "Qatar" },
  { value: "UAE", label: "UAE" },
  { value: "Yemen", label: "Yemen" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "Austria", label: "Austria" },
  { value: "Hungary", label: "Hungary" },
  { value: "Romania", label: "Romania" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Ireland", label: "Ireland" },
  { value: "Norway", label: "Norway" },
  { value: "Sweden", label: "Sweden" },
  { value: "Finland", label: "Finland" },
  { value: "Spain", label: "Spain" },
  { value: "Italy", label: "Italy" },
  { value: "Greece", label: "Greece" },
  { value: "Turkey", label: "Turkey" },
  { value: "Portugal", label: "Portugal" },
  { value: "Algeria", label: "Algeria" },
  { value: "Libya", label: "Libya" },
  { value: "Niger", label: "Niger" },
  { value: "Mali", label: "Mali" },
  { value: "Chad", label: "Chad" },
  { value: "Sudan", label: "Sudan" },
  { value: "Ethiopia", label: "Ethiopia" },
  { value: "Somalia", label: "Somalia" },
  { value: "Kenya", label: "Kenya" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "Zambia", label: "Zambia" },
  { value: "Zimbabwe", label: "Zimbabwe" },
  { value: "Botswana", label: "Botswana" },
  { value: "South Africa", label: "South Africa" },
  { value: "Namibia", label: "Namibia" },
  { value: "Angola", label: "Angola" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Egypt", label: "Egypt" },
  { value: "DRC", label: "DRC" },
  { value: "Mexico", label: "Mexico" },
  { value: "Brazil", label: "Brazil" },
  { value: "Chile", label: "Chile" },
  { value: "Argentina", label: "Argentina" },
  { value: "Peru", label: "Peru" },
  { value: "Colombia", label: "Colombia" },
  { value: "Ecuador", label: "Ecuador" },
  { value: "Venezuela", label: "Venezuela" },
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Iceland", label: "Iceland" },
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "China", label: "China" },
  { value: "Japan", label: "Japan" },
  { value: "Mongolia", label: "Mongolia" },
  { value: "Russia", label: "Russia" },
  { value: "Thailand", label: "Thailand" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Philippines", label: "Philippines" },
  { value: "Papua New Guinea", label: "Papua New Guinea" },
  { value: "Australia", label: "Australia" },
  { value: "New Zealand", label: "New Zealand" },
  { value: "Israel", label: "Israel" },
  { value: "Mauritius", label: "Mauritius" },
].sort((a, b) => a.label.localeCompare(b.label));

const categories = [
  "Modern Home Design",
  "Duplex House Plans",
  "Single Storey House Plan",
  "Bungalow / Villa House Plans",
  "Apartment / Flat Plans",
  "Farmhouse",
  "Cottage Plans",
  "Row House / Twin House Plans",
  "Village House Plans",
  "Contemporary / Modern House Plans",
  "Colonial / Heritage House Plans",
  "Classic House Plan",
  "Kerala House Plans",
  "Kashmiri House Plan",
  "Marriage Garden",
  "Hospitals",
  "Shops and Showrooms",
  "Highway Resorts and Hotels",
  "Schools and Colleges Plans",
  "Temple & Mosque",
];

// Helper Component
const MultiSelectCountry: React.FC<MultiSelectCountryProps> = ({
  selected,
  setSelected,
  options,
  placeholder,
}) => {
  const handleSelect = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const displayText =
    selected.length > 0 ? `${selected.length} countries selected` : placeholder;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
        >
          {displayText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            onCheckedChange={() => handleSelect(option.value)}
            onSelect={(e) => e.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<IProductFormData>();

  // State Management
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [planFiles, setPlanFiles] = useState<File[]>([]);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [propertyType, setPropertyType] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [planType, setPlanType] = useState<string>("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isSale, setIsSale] = useState<boolean>(false);
  const [crossSell, setCrossSell] = useState<string[]>([]);
  const [upSell, setUpSell] = useState<string[]>([]);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      // Create a comprehensive defaultValues object for react-hook-form
      // This handles both standard and imported (JSON/CSV) data formats
      const defaultValues: IProductFormData = {
        name: product.name || product.Name || "",
        description: product.description || product["Short description"] || "",
        youtubeLink: product.youtubeLink || "",
        productNo: String(product.productNo || product.SKU || ""),
        city: product.city || "",
        plotSize: product.plotSize || "",
        plotArea: product.plotArea || 0,
        rooms: Number(product.rooms) || 0,
        bathrooms: product.bathrooms || undefined,
        kitchen: product.kitchen || undefined,
        floors: Number(product.floors) || undefined,
        price: product.price ?? product["Regular price"] ?? 0,
        salePrice: product.salePrice ?? product["Sale price"] ?? undefined,
        taxRate: product.taxRate ?? product["Tax class"] ?? undefined,
        category:
          (Array.isArray(product.category)
            ? product.category[0]
            : product.category) ||
          (product.Categories ? product.Categories.split(",")[0].trim() : ""),
        seoTitle: product.seo?.title || "",
        seoAltText: product.seo?.altText || "",
        seoDescription: product.seo?.description || "",
        seoKeywords: product.seo?.keywords || "",
        contactName: product.contactName || "",
        contactEmail: product.contactEmail || "",
        contactPhone: product.contactPhone || "",
      };
      reset(defaultValues);

      // Set state for controlled components outside of react-hook-form
      setPropertyType(product.propertyType || "");
      setDirection(product.direction || "");
      setPlanType(product.planType || "");

      const countries = Array.isArray(product.country)
        ? product.country
        : typeof product.country === "string"
          ? product.country
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [];
      setSelectedCountries(countries);

      setIsSale(product.isSale || product["Is featured?"] === 1 || false);

      const getProductIds = (prodList: any) => {
        if (!prodList) return [];
        if (typeof prodList === "string")
          return prodList
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        if (Array.isArray(prodList))
          return prodList.map((p) => (typeof p === "string" ? p : p._id));
        return [];
      };

      setCrossSell(
        getProductIds(product.crossSellProducts || product["Cross-sells"])
      );
      setUpSell(getProductIds(product.upSellProducts || product.Upsells));

      // Reset file states
      setMainImage(null);
      setGalleryImages([]);
      setPlanFiles([]);
      setHeaderImage(null);
    }
  }, [product, reset]);

  // Data processing
  const productOptions = products
    ? products
        .filter((p) => p._id !== product?._id)
        .map((p) => ({ value: p._id, label: p.name || p.Name || "Untitled" }))
    : [];

  // Event Handlers
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

  const onSubmit = async (data: IProductFormData) => {
    if (!product) return;

    if (selectedCountries.length === 0 || !propertyType || !planType) {
      toast.error(
        "Please select at least one Country, a Property Type, and a Plan Type."
      );
      return;
    }

    const formData = new FormData();

    // Append all form data
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof IProductFormData];
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append state-managed data
    formData.append("country", selectedCountries.join(","));
    formData.append("propertyType", propertyType);
    formData.append("direction", direction);
    formData.append("planType", planType);
    formData.append("isSale", String(isSale));
    formData.append("crossSellProducts", crossSell.join(","));
    formData.append("upSellProducts", upSell.join(","));

    // Append files only if new files are selected
    if (mainImage) formData.append("mainImage", mainImage);
    if (headerImage) formData.append("headerImage", headerImage);
    galleryImages.forEach((file) => formData.append("galleryImages", file));
    planFiles.forEach((file) => formData.append("planFile", file));

    try {
      await dispatch(
        updateProduct({ productId: product._id, productData: formData })
      ).unwrap();
      toast.success("Product updated successfully!");
      dispatch(fetchProducts({})); // Refetch products to see updates
      onClose();
    } catch (error) {
      toast.error(String(error) || "Failed to update product.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Editing:{" "}
            <span className="font-semibold">
              {product?.name || product?.Name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information */}
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
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">
                      Description (For H2, H3 tags)*
                    </Label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value || ""}
                          onChange={field.onChange}
                          modules={quillModules}
                          className="mt-1 bg-white"
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
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

              {/* Product Specifications */}
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
                        {errors.productNo.message}
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
                        {errors.city.message}
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
                        {errors.plotSize.message}
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
                        valueAsNumber: true,
                      })}
                    />
                    {errors.plotArea && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.plotArea.message}
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
                        valueAsNumber: true,
                      })}
                    />
                    {errors.rooms && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.rooms.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      {...register("bathrooms", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kitchen">Kitchen</Label>
                    <Input
                      id="kitchen"
                      type="number"
                      {...register("kitchen", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="floors">Floors</Label>
                    <Input
                      id="floors"
                      type="number"
                      {...register("floors", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Facing Direction</Label>
                    <Select onValueChange={setDirection} value={direction}>
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
                    <MultiSelectCountry
                      selected={selectedCountries}
                      setSelected={setSelectedCountries}
                      options={countries}
                      placeholder="Select countries..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SEO & Marketing */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Marketing</CardTitle>
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
                      <MultiSelectForProducts
                        options={productOptions}
                        selected={crossSell}
                        onChange={setCrossSell}
                        className="mt-1"
                        placeholder="Select related products..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="upSellProducts">Up-Sell Products</Label>
                      <MultiSelectForProducts
                        options={productOptions}
                        selected={upSell}
                        onChange={setUpSell}
                        className="mt-1"
                        placeholder="Select premium alternatives..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information - Show only for Construction Products */}
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

              {/* Files */}
              <Card>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                  <p className="text-sm text-gray-600">
                    Upload new files to replace existing ones (optional)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="mainImage">Main Image</Label>
                    <Input
                      id="mainImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setMainImage(e.target.files ? e.target.files[0] : null)
                      }
                    />
                    {product?.mainImage && (
                      <p className="text-sm text-gray-500 mt-1">
                        Current: {product.mainImage}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="galleryImages">
                      Gallery Images (Up to 5)
                    </Label>
                    <Input
                      id="galleryImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryImagesChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="headerImage">
                      Downloadable Header Image
                    </Label>
                    <Input
                      id="headerImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setHeaderImage(
                          e.target.files ? e.target.files[0] : null
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="planFileInput">Plan Files</Label>
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

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing & Tax */}
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
                      {...register("price", {
                        required: "Price is required",
                        valueAsNumber: true,
                      })}
                    />
                    {errors.price && (
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
                      {...register("salePrice", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      {...register("taxRate", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isSale"
                      checked={isSale}
                      onCheckedChange={(checked: CheckedState) =>
                        setIsSale(checked === true)
                      }
                    />
                    <Label htmlFor="isSale">This product is on sale</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Organization */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Plan Type*</Label>
                    <Select onValueChange={setPlanType} value={planType}>
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
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // Use value instead of defaultValue for controlled component
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {categories.map((cat, index) => (
                              <SelectItem key={index} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Property Type*</Label>
                    <Select
                      onValueChange={setPropertyType}
                      value={propertyType}
                    >
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

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
