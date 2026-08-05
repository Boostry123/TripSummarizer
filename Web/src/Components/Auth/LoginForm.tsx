import { useState } from "react";
import { HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to sign in. Please check your credentials.",
      );
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold mb-2">Welcome Back</h2>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-bold p-2">Email</label>
          <div className="relative">
            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="email"
              required
              disabled={isLoggingIn}
              className="w-full border py-3.5 rounded-xl pl-11 font-bold"
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
              disabled={isLoggingIn}
              className="w-full border py-3.5 rounded-xl pl-11 font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full border rounded-xl flex  justify-center py-3.5 font-bold text-2xl hover:bg-primary-0 transition-colors duration-200 cursor-pointer"
        >
          {isLoggingIn ? (
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
          Don't have an account?{" "}
          <button
            onClick={onToggle}
            disabled={isLoggingIn}
            className="text-black font-bold cursor-pointer"
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
