// src/pages/admin/blogs/AdminAddEditBlogPage.jsx

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createPost,
  updatePost, // ✨ updatePost को import करें
  fetchPostBySlug,
  clearCurrentPost,
} from "@/lib/features/blog/blogSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const AdminAddEditBlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { post, status: postStatus } = useSelector(
    (state: RootState) => state.blog
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(slug);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      author: "Admin",
      status: "Draft",
      content: "",
      mainImage: null,
    },
  });

  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue && !isEditing) {
      const generatedSlug = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [titleValue, setValue, isEditing]);

  useEffect(() => {
    if (isEditing && slug) {
      dispatch(fetchPostBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug, isEditing]);

  useEffect(() => {
    if (isEditing && post) {
      reset({
        title: post.title,
        slug: post.slug,
        description: post.description,
        author: post.author,
        status: post.status,
        content: post.content,
      });
    }
  }, [post, isEditing, reset]);

  // --- ✨ FIX IS HERE: Updated onSubmit function ---
  const onSubmit = (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "mainImage") {
        formData.append(key, data[key]);
      }
    });
    if (data.mainImage && data.mainImage[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    if (isEditing && post) {
      dispatch(updatePost({ postId: post._id, postData: formData })).then(
        (result) => {
          if (updatePost.fulfilled.match(result)) {
            toast.success("Blog post updated successfully!");
            navigate("/admin/blogs");
          } else {
            toast.error(String(result.payload) || "Failed to update post.");
          }
          setIsSubmitting(false);
        }
      );
    } else {
      dispatch(createPost({ postData: formData })).then((result) => {
        if (createPost.fulfilled.match(result)) {
          toast.success("Blog post created successfully!");
          navigate("/admin/blogs");
        } else {
          toast.error(String(result.payload) || "Failed to create post.");
        }
        setIsSubmitting(false);
      });
    }
  };
  // --- END OF FIX ---

  if (isEditing && postStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        {isEditing ? "Edit Blog Post" : "Add New Blog Post"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-8 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" className="font-semibold">
              Post Title
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required." })}
              className="mt-2"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="slug" className="font-semibold">
              URL Slug
            </Label>
            <Input
              id="slug"
              {...register("slug", { required: "Slug is required." })}
              className="mt-2 bg-gray-50"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="description" className="font-semibold">
            Short Description
          </Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "Description is required.",
            })}
            className="mt-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <Label className="font-semibold">Main Content</Label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Main content is required." }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="mt-2 bg-white"
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="author" className="font-semibold">
              Author
            </Label>
            <Input
              id="author"
              {...register("author", { required: "Author is required." })}
              className="mt-2"
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1">
                {errors.author.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="status" className="font-semibold">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="mainImage" className="font-semibold">
              Main Image
            </Label>
            <Input
              id="mainImage"
              type="file"
              {...register("mainImage", { required: !isEditing })}
              accept="image/*"
              className="mt-2"
            />
            {errors.mainImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mainImage.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddEditBlogPage;
