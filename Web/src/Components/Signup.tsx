import { useState } from "react";
import { HiMail, HiLockClosed, HiUser, HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { authService } from "@/Apis/authService";
import { useAuthStore } from "@/store/authStore";

interface SignupProps {
  onToggle: () => void;
}

const Signup: React.FC<SignupProps> = ({ onToggle }) => {
  const navigate = useNavigate();
  const signupStore = useAuthStore((state) => state.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.signup({ name, email, password });
      signupStore(response.user, response.token);
      navigate("/");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
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
          <label className="block text-sm font-medium mb-1.5 ml-1">
            Full Name
          </label>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              required
              disabled={loading}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1">Email</label>
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="email"
              required
              disabled={loading}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 ml-1">
            Password
          </label>
          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="password"
              required
              disabled={loading}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account <HiArrowRight />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={onToggle}
            disabled={loading}
            className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors disabled:opacity-50"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
