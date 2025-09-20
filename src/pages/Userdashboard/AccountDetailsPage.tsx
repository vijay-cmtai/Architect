import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const AccountDetailsPage = () => {
  // Get user info from Redux to pre-fill the form
  const { userInfo } = useSelector((state: { user: any }) => state.user);

  // State to manage form inputs
  const [formState, setFormState] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // Example: Update user details, then update password if fields are filled
    console.log("Updating Account Details:", {
      name: formState.name,
      email: formState.email,
    });

    if (
      formState.newPassword &&
      formState.newPassword === formState.confirmPassword
    ) {
      console.log("Updating Password...");
    } else if (formState.newPassword) {
      alert("New passwords do not match!");
    }

    alert("Account details saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Account Details</h1>
        <p className="mt-2 text-gray-600">
          Manage your personal information and password.
        </p>
      </div>

      <Separator />

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This email is used for login and order notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Change Password
          </h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg border">
            <div>
              <Label htmlFor="currentPassword">
                Current Password (leave blank to leave unchanged)
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formState.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">
                New Password (leave blank to leave unchanged)
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={formState.newPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="btn-primary" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetailsPage;
