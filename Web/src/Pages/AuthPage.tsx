import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Components/Card";
import LoginForm from "@/Components/LoginForm";
import Signup from "@/Components/Signup";
import { useMobile } from "@/hooks/useMobile";
import { useAuthStore } from "@/store/authStore";

const AuthPage = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => !!state.token);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col min-h-[calc(100vh-64px)]">
      <main className="grow flex items-center justify-center p-6 pb-20 mt-10 md:mt-0">
        <Card
          className="w-full max-w-md"
          padding={isMobile ? "small" : "medium"}
        >
          {isLogin ? (
            <LoginForm onToggle={() => setIsLogin(false)} />
          ) : (
            <Signup onToggle={() => setIsLogin(true)} />
          )}
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
