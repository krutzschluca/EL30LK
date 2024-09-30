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

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    insuranceNumber: '',
    role: 'patient', // default role
  });

  const handleLogin = async (e) => {
    console.log("login hit")
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password: password.trim() }),
    });
  
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Log message to check if function is called
    console.log("handleRegister function called");
  
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      console.log("Response data:", data); // Log response data
  
      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert('Server error');
    }
  };
  

  // Conditional handler for login or register based on mode
  const buttonHandler = (e) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

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
            <Input 
              id="username" 
              placeholder="Enter your username" 
              required 
              value={isLogin ? username : formData.username} 
              onChange={(e) => {
                if (isLogin) {
                  setUsername(e.target.value); // Update individual username state for login
                } else {
                  setFormData({ ...formData, username: e.target.value }); // Update formData for registration
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              required 
              value={isLogin ? password : formData.password} // Use password for login, formData.password for register 
              onChange={(e) => {
                if (isLogin) {
                  setPassword(e.target.value); // Update individual password state for login
                } else {
                  setFormData({ ...formData, password: e.target.value }); // Update formData for registration
                }
              }}
            />
          </div>
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">Insurance Number</Label>
                <Input 
                  id="insuranceNumber" 
                  placeholder="Enter your insurance number" 
                  required 
                  value={formData.insuranceNumber} 
                  onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
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
          <Button className="w-full" onClick={buttonHandler}>
            {isLogin ? "Login" : "Register"}
          </Button>
          <Button variant="link" onClick={toggleMode}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
