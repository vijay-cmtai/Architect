import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { toast } from "sonner";
import {
  registerUser,
  resetActionStatus,
} from "@/lib/features/users/userSlice";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const professionalSubRoles = [
  "Architect / Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
  "MEP Consultant",
];

const ApplicationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  // "Careers" page se bheja gaya job title get karein
  const { jobTitle = "" } = location.state || {};

  const { actionStatus, error, userInfo } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    role: "professional",
    name: "",
    email: "",
    phone: "",
    password: "",
    profession: jobTitle,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, profession: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key]) dataToSubmit.append(key, formData[key]);
    }
    dispatch(registerUser(dataToSubmit));
  };

  useEffect(() => {
    if (actionStatus === "succeeded" && userInfo) {
      toast.success("Application submitted! Your account is pending approval.");
      dispatch(resetActionStatus());
      navigate("/login");
    }
    if (actionStatus === "failed") {
      toast.error(error || "Registration failed. Please try again.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, userInfo, error, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-soft-teal px-4 py-12">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Apply for a Position
            </CardTitle>
            <CardDescription>
              Create your professional account to submit your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number*</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Create Password*</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profession">Applying for*</Label>
                <Select
                  value={formData.profession}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger id="profession">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalSubRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationPage;
