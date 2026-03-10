"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Account created!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        <input
          className="w-full p-2 mb-4 bg-zinc-800 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 bg-zinc-800 rounded"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 py-2 rounded"
        >
          Register
        </button>
      </div>
    </main>
  );
}