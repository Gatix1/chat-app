import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { toast } from 'react-hot-toast';
import { MessageSquare, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern.jsx';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required!");
    if (!formData.email.trim()) return toast.error("Email is required!");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format!"); // Email checking regex
    if (!formData.password.trim()) return toast.error("Password is required!");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters!");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (validateForm) {
      login(formData.email, formData.password);
    }
  };
  
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary"/>
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back!</h1>
              <p className="text-base-content/60">Sign in to continue.</p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div className="form-control">
              {/* Email input */}
              <label className="label">
                <span className="label-text">E-mail</span>
              </label>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-6 text-base-cotnent/40"/>
                </div>
                <input type="text" id="email" className="input input-bordered w-full pl-12" placeholder="E-mail" onChange={(e) => setFormData({...formData, email: e.target.value})}/>
              </div>
              {/* Password input */}
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-6 text-base-cotnent/40"/>
                </div>
                <input type={showPassword ? "text" : "password"} id="password" className="input input-bordered w-full pl-12" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye className="size-6 text-base-cotnent/40"/> : <EyeOff className="size-6 text-base-cotnent/40"/>}
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-6 animate-spin mr-2"/>
                  <span>Loading...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
          {/* Signup link */}
          <div className="text-center">
              <p className="text-base-content/60">
                Don't have an account yet?{" "}
                <Link to="/signup" className="link link-primary">Create Account</Link>
              </p>
          </div>
        </div> 
      </div>

      {/* Right side */}
      <AuthImagePattern title="Welcome to the MERN-Chat." subtitle="A fullstack chat application using MERN stack."/>
    </div>
  );
}

export default LoginPage;