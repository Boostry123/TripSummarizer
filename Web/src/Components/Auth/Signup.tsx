import { useState } from "react";
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface SignupProps {
  onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggle }) => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signup({ name, email, password });
      navigate("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to create account. Please try again.",
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2">Create Account</h2>
        <p className="text-slate-500 text-sm">
          Join TripSummarizer to start your travel log.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-bold m-2">Full Name</label>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              required
              disabled={isSigningUp}
              className="w-full pl-11 border rounded-xl py-3.5 font-bold text-black"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-bold m-2">Email</label>
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="email"
              required
              disabled={isSigningUp}
              className="w-full pl-11 border rounded-xl py-3.5 font-bold"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-bold m-2">Password</label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="password"
              required
              disabled={isSigningUp}
              className="bg-primary-0 w-full pl-11 border rounded-xl py-3.5 font-bold"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className="w-full border rounded-xl flex  justify-center py-3.5 font-bold text-2xl hover:bg-primary-0 transition-colors duration-200 cursor-pointer"
        >
          {isSigningUp ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-primary-2 rounded-full animate-spin" />
          ) : (
            <>
              <HiArrowRight />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={onToggle}
            disabled={isSigningUp}
            className="text-black font-bold cursor-pointer"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
