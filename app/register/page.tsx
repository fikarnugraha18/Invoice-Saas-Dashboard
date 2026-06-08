"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Register gagal");
        return;
      }

      alert("Register success, please login");

      router.push("/login");

    } catch (error) {
      console.error(error);

      alert("Terjadi kesalahan, coba lagi");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">

        <h1 className="text-2xl font-bold text-center mb-6">
          Create Finvo Account
        </h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full mb-3 rounded"
          placeholder="Email"
          disabled={loading}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border p-3 w-full mb-4 rounded"
          placeholder="Password"
          disabled={loading}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`
            w-full
            py-3
            rounded
            font-medium
            transition

            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }

            text-white
          `}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium"
          >
            Login
          </a>
        </p>

      </div>

    </div>
  );
}