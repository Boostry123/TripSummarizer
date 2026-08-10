import { default as supabase } from "@/Config/Db.js";
import { eq } from "drizzle-orm";
import db from "@/Db/Client.js";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthServiceResponse,
} from "@/Types/auth.js";
import { profiles } from "@/Db/Schema.js";

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
  if (!data.user) {
    return {
      error: { status: 400, message: "User not created" },
    };
  }
  const userProfile = await getCurrentUser(data.user.id);

  return {
    user: {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: userProfile.user?.name || "",
    },
    token: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
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

  const userProfile = await getCurrentUser(data.user.id);

  return {
    user: {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: userProfile.user?.name || "",
    },
    token: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
  };
};

export const refresh = async (
  refreshToken: string,
): Promise<AuthServiceResponse> => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) {
    return { error: { status: error.status || 400, message: error.message } };
  }
  if (!data.user) {
    return {
      error: { status: 400, message: "User not created" },
    };
  }
  const userProfile = await getCurrentUser(data.user.id);

  return {
    user: {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: userProfile.user?.name || "",
    },
    token: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
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
  userId: string,
): Promise<AuthServiceResponse> => {
  try {
    const [data] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!data) {
      return {
        error: { status: 400, message: "Profile not found" },
      };
    }
    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name || "",
      },
    };
  } catch (error: unknown) {
    console.error("Getting user error", error);
    return {
      error: { status: 500, message: "Database error" },
    };
  }
};
