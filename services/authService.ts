import { supabase } from "./supabaseClient";

export const authService = {
  // 🔐 Email + Password Signup
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  },

  // 🔐 Email + Password Login
  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // ✉️ Send OTP to Email
  async sendOtp(email: string) {
    return await supabase.auth.signInWithOtp({
      email,
    });
  },

  // 🔢 Verify OTP
  async verifyOtp(email: string, token: string) {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
  },

  // 🌐 Google Login
  async googleLogin() {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  },

  // 🚪 Logout
  async logout() {
    return await supabase.auth.signOut();
  },

  // 🔁 Get Session
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
  },
};