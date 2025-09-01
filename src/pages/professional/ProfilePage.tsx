import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const dispatch = useDispatch<any>();
  const { userInfo, actionStatus, error } = useSelector(
    (state: { user: any }) => state.user
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Jab bhi userInfo mile, form ko pre-fill karein
    if (userInfo) {
      setValue("name", userInfo.name);
      setValue("email", userInfo.email);
      setValue("phone", userInfo.phone);
      setValue("profession", userInfo.profession);
      // ... baaki fields
    }
  }, [userInfo, setValue]);

  const onSubmit = (data) => {
    // Sirf wohi data bhejein jo user ne enter kiya hai
    dispatch(updateProfile(data)); // Typing fixed by casting dispatch to any above
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(error || "Failed to update profile.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  if (!userInfo) {
    return <div className="p-12 text-center">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      <p className="text-gray-600">
        Update your public profile and account details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userInfo.photoUrl} alt={userInfo.name} />
                <AvatarFallback className="text-4xl">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-picture">
                  Profile Picture (Coming Soon)
                </Label>
                <Input
                  id="profile-picture"
                  type="file"
                  className="mt-1"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  File upload for profile update will be added later.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name / Business Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {typeof errors.name.message === "string"
                      ? errors.name.message
                      : ""}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={userInfo.email}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed.
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {typeof errors.phone.message === "string"
                      ? errors.phone.message
                      : ""}
                  </p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  id="role"
                  disabled
                  value={userInfo.role}
                  className="capitalize"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific fields */}
        {userInfo.role === "professional" && (
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="profession">Your Profession</Label>
                <Input id="profession" {...register("profession")} />
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          className="btn-primary"
          size="lg"
          disabled={actionStatus === "loading"}
        >
          {actionStatus === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
