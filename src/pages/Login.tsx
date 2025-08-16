import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background p-4 font-poppins">
        <div className="bg-card text-foreground p-8 sm:p-10 rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground mt-2">
              Login to access your account
            </p>
          </div>

          <form>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    name="remember-me"
                    className="h-4 w-4 rounded text-primary focus:ring-primary border-border"
                  />
                  <label htmlFor="remember-me" className="text-sm">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-8 text-base font-bold py-3"
            >
              Login
            </Button>

            <div className="relative my-8 flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs uppercase text-muted-foreground">
                Or continue with
              </span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Optional: Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                {/* <GoogleIcon className="mr-2 h-5 w-5" /> You can add an icon here */}
                Google
              </Button>
              <Button variant="outline" className="w-full">
                {/* <FacebookIcon className="mr-2 h-5 w-5" /> You can add an icon here */}
                Facebook
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register now
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
