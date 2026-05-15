import { getSupabaseClient, default as supabase } from "@/Config/Db.js";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthServiceResponse,
} from "@/Types/auth.js";
import { Profile } from "@/Types/database.js";

export const signup = async (
  credentials: RegisterCredentials,
): Promise<AuthServiceResponse> => {
  const { email, password, name } = credentials;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || "",
      },
    },
  });

  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }

  return {
    user: {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: data.user?.user_metadata?.name || "",
    },
    token: data.session?.access_token,
  };
};

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthServiceResponse> => {
  const { email, password } = credentials;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }

  return {
    user: {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: data.user?.user_metadata?.name || "",
    },
    token: data.session?.access_token,
  };
};

export const logout = async (): Promise<{
  error?: { status: number; message: string };
}> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }
  return {};
};

export const getCurrentUser = async (
  token: string,
  userId: string,
): Promise<AuthServiceResponse> => {
  const supabaseAuthenticated = getSupabaseClient(token);
  const { data, error } = await supabaseAuthenticated
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single<Profile>();

  if (error || !data) {
    return {
      error: { status: 400, message: error?.message || "Profile not found" },
    };
  }

  return {
    user: {
      id: data.id,
      email: data.email,
      name: data.name || "",
    },
  };
};
