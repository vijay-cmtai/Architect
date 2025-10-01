import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { loginUser, resetActionStatus } from "@/lib/features/users/userSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = actionStatus === "loading";

  useEffect(() => {
    // Check if user is already logged in and redirect accordingly
    if (userInfo) {
      // Only allow specific roles to login and access dashboards
      switch (userInfo.role) {
        case "admin":
          navigate("/admin");
          break;
        case "professional":
          navigate("/professional");
          break;
        case "user":
          navigate("/");
          break;
        default:
          // For seller and Contractor roles, show error and logout
          toast.error(
            "Your account type is not authorized to login to this platform."
          );
          // You might want to add a logout action here if needed
          // dispatch(logoutUser());
          break;
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    // Handle login response
    if (actionStatus === "succeeded" && userInfo) {
      // Check if the logged-in user has an allowed role
      if (["user", "admin", "professional"].includes(userInfo.role)) {
        switch (userInfo.role) {
          case "admin":
            toast.success("Admin login successful! Redirecting...");
            setTimeout(() => navigate("/admin"), 1000);
            break;
          case "professional":
            toast.success("Professional login successful! Redirecting...");
            setTimeout(() => navigate("/professional"), 1000);
            break;
          case "user":
          default:
            toast.success("Login successful! Redirecting...");
            setTimeout(() => navigate("/"), 1000);
        }
      } else {
        // Unauthorized role attempting to login
        toast.error(
          "Your account type is not authorized to access this platform."
        );
        dispatch(resetActionStatus());
      }
    }

    if (actionStatus === "failed" && error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [actionStatus, userInfo, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    (dispatch as AppDispatch)(loginUser({ email, password }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
