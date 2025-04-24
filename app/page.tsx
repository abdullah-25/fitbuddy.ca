"use client"
import { useRouter } from "next/navigation"
import { Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInForm from "@/components/sign-in-form"
import SignUpForm from "@/components/sign-up-form"

export default function AuthPage() {
  const router = useRouter()

  const handleGuestAccess = () => {
    // In a real app, you might set a guest flag in localStorage or context
    localStorage.setItem("fitbuddy-guest", "true")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and App Name */}
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-emerald-500 p-3 rounded-full">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">FitBuddy</h1>
          <p className="text-muted-foreground text-center">Track your workouts. Achieve your goals.</p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome to FitBuddy</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one to track your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGuestAccess}>
              Continue as Guest
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
