import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
type AppDispatch = typeof store.dispatch;
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Loader2 ko import karein

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

  // ✨ FIX 1: actionStatus ko 'loading' se badal dein. Yeh zyada descriptive hai.
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = actionStatus === "loading";

  useEffect(() => {
    // Agar user pehle se logged in hai, toh use redirect kar dein
    if (userInfo) {
      // ✨ FIX 2: Redirection logic ko aasan banaya gaya hai
      switch (userInfo.role) {
        case "admin":
          navigate("/admin");
          break;
        case "professional":
          navigate("/professional");
          break;
        default:
          navigate("/");
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    // Component load hone par ya error aane par state reset karein
    if (error) {
      toast.error(error);
      dispatch(resetActionStatus());
    }
  }, [error, dispatch]);

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
              {/* ✨ FIX 3: disabled={isLoading} aur loading spinner add kiya gaya ✨ */}
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
