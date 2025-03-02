"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `auth_token=${data.token}; path=/; max-age=86400;`;
        router.push("/admin/properties"); // 🔹 Redirige después de iniciar sesión
      } else {
        setError(data.message || "Error en el inicio de sesión");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-600 text-center">{error}</p>} {/* ✅ Corrección del uso de error */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
