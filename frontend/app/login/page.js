"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Switch } from "../../components/ui/switch"

const handleLogin = async (e) => {
  e.preventDefault();
  // Replace this with your actual API call
  const res = await fetch('http://localhost:5000/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok) {
    // Save the token in local storage or cookie
    localStorage.setItem('token', data.token);
    // Redirect to main page
    router.push('/');
  } else {
    alert(data.message);
  }
};

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const { theme, setTheme } = useTheme()
  const router = useRouter();

  const toggleMode = () => setIsLogin(!isLogin)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md mb-4 flex justify-end">
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
          size="lg"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Switch>
        <Button onClick={() => router.push('/')}>Go to Home</Button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Dr. Doe's Clinic</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter your username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" required />
          </div>
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">Insurance Number</Label>
                <Input id="insuranceNumber" placeholder="Enter your insurance number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">{isLogin ? "Login" : "Register"}</Button>
          <Button variant="link" onClick={toggleMode}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}