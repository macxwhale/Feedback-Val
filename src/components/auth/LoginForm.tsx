
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, Star } from "lucide-react";
import { useAuthFlow } from "@/hooks/useAuthFlow";

export const LoginForm: React.FC = () => {
  const {
    email, setEmail, password, setPassword,
    loading, orgLoading, error, handleSignIn, handleSignUp
  } = useAuthFlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-coral-50 to-golden-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sunset-500 hover:text-sunset-600 mb-8 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-sunset-100 w-16 h-16 rounded-full flex items-center justify-center text-sunset-500 mb-4 shadow-md">
              <Activity className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-space font-extrabold text-warm-gray-900">Welcome to Pulsify</CardTitle>
            <p className="text-warm-gray-500 font-medium">Sign in to your organization account</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-warm-gray-100/80 border border-warm-gray-200 rounded-lg shadow-sm">
                <TabsTrigger value="signin" className="font-semibold text-warm-gray-700">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="font-semibold text-warm-gray-700">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="font-medium text-warm-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="your-email@company.com"
                      className="bg-white border-warm-gray-200 focus:border-sunset-400 focus:ring-sunset-300 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="font-medium text-warm-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="bg-white border-warm-gray-200 focus:border-sunset-400 focus:ring-sunset-300 text-base"
                    />
                  </div>
                  {error && (
                    <Alert className="bg-red-50 border border-red-200">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-base font-bold rounded-full shadow-lg shadow-sunset-500/20"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <Label htmlFor="signup-email" className="font-medium text-warm-gray-700">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="your-email@company.com"
                      className="bg-white border-warm-gray-200 focus:border-sunset-400 focus:ring-sunset-300 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="font-medium text-warm-gray-700">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                      className="bg-white border-warm-gray-200 focus:border-sunset-400 focus:ring-sunset-300 text-base"
                    />
                  </div>
                  {error && (
                    <Alert className="bg-red-50 border border-red-200">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-sunset-500 to-coral-500 hover:from-sunset-600 hover:to-coral-600 text-white text-base font-bold rounded-full shadow-lg shadow-sunset-500/20"
                    disabled={loading || orgLoading}
                  >
                    {(loading || orgLoading) ? "Creating account..." : "Sign Up"}
                  </Button>
                  <div className="text-xs text-center text-warm-gray-400 mt-3">
                    After verifying your email, you will create your organization in the next step.
                  </div>
                </form>
              </TabsContent>
            </Tabs>
            {/* Removed admin login link as requested */}
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <span className="text-xs flex items-center justify-center gap-2 text-warm-gray-400">
            <Star className="w-3 h-3 text-sunset-500" />
            Real Insights. Real Impact.
          </span>
        </div>
      </div>
    </div>
  );
};
