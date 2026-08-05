import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Components/Common/Card";
import LoginForm from "@/Components/Auth/LoginForm";
import Signup from "@/Components/Auth/Signup";
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
    <div className="flex-1 flex items-center justify-center p-6 py-12">
      <main className="w-full max-w-md">
        <Card
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
