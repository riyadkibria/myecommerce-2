"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase.config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

interface LoginFormSectionProps {
  onClose: () => void;
}

export default function LoginFormSection({ onClose }: LoginFormSectionProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // For showing info messages (like verification sent)
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Send verification email
        if (userCredential.user) {
          await sendEmailVerification(userCredential.user);
          setInfo(
            "Verification email sent! Please check your inbox and verify your email before logging in."
          );
          setLoading(false);
          setIsSignUp(false); // Switch to login form after sign-up
          setEmail(""); // clear fields
          setPassword("");
          return;
        }
      } else {
        // Login existing user
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Check if email is verified
        if (userCredential.user.emailVerified) {
          router.push("/admin");
        } else {
          setError(
            "Email not verified! Please check your inbox and verify your email before logging in."
          );
          await auth.signOut(); // Sign out unverified user immediately
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close login form"
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center select-none">
        {isSignUp ? "Create an Account" : "Welcome Back"}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-5 rounded-md bg-red-50 p-3 text-center text-sm text-red-700 font-semibold select-text">
          {error}
        </div>
      )}

      {/* Info Message */}
      {info && (
        <div className="mb-5 rounded-md bg-green-50 p-3 text-center text-sm text-green-700 font-semibold select-text">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Email address"
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          spellCheck={false}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          spellCheck={false}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg py-3 text-white font-semibold shadow-md transition focus:ring-4 focus:outline-none ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-300"
          }`}
        >
          {loading
            ? isSignUp
              ? "Signing up..."
              : "Logging in..."
            : isSignUp
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={`mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 font-semibold transition focus:ring-4 focus:outline-none ${
          loading
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 focus:ring-gray-300"
        }`}
        aria-label="Continue with Google"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M533.5 278.4c0-17.5-1.4-34.3-4.3-50.6H272v95.9h147.1c-6.3 33.9-25 62.6-53.3 81.9v67h86.1c50.4-46.5 79.6-114.8 79.6-194.2z"
            fill="#4285F4"
          />
          <path
            d="M272 544.3c72.9 0 134.1-24.2 178.7-65.7l-86.1-67c-24 16.2-54.9 25.8-92.6 25.8-71 0-131.2-47.9-152.8-112.3h-89.9v70.6c44.3 87 134.6 148.6 242.7 148.6z"
            fill="#34A853"
          />
          <path
            d="M119.2 321.1c-10.4-30.7-10.4-63.9 0-94.6v-70.6h-89.9c-37.4 73.7-37.4 161.3 0 235l89.9-69.8z"
            fill="#FBBC05"
          />
          <path
            d="M272 107.7c39.5-.6 77.5 14 106.4 40.7l79.6-79.6C393.7 24.2 334.8 0 272 0 163.9 0 73.6 61.5 29.3 148.5l89.9 69.8c21.6-64.5 81.8-112.3 152.8-112.3z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm text-gray-600 select-none">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setError("");
            setInfo("");
            setIsSignUp(!isSignUp);
          }}
          className="font-semibold text-blue-600 hover:underline focus:outline-none"
          disabled={loading}
        >
          {isSignUp ? "Log in here" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
