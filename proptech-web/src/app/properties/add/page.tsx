"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProperty() {
  const router = useRouter();
  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image_url: "", // 🔹 Ahora `image_url` correctamente definido
    property_type: "apartment"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      title: property.title,
      description: property.description,
      price: parseFloat(property.price),
      location: property.location,
      image_url: property.image_url, // ✅ Ahora `image_url` está correctamente estructurado
      property_type: property.property_type,
      user_id: 1  // 🔹 Asegúrate de que este usuario existe en la BD
    };

    console.log("📌 BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL);  // ✅ Verifica la URL del backend
    console.log("📤 Enviando JSON:", JSON.stringify(payload, null, 2));  // ✅ Verifica qué datos se están enviando

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log("📥 Respuesta de la API:", JSON.stringify(data, null, 2));  // ✅ Imprime la respuesta del backend

      if (response.ok) {
        setMessage("✅ Propiedad agregada exitosamente!");
        setTimeout(() => {
          router.push("/properties");
        }, 1500);
      } else {
        setMessage(`❌ Error en la API: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("🚨 Error en la solicitud:", error);
      setMessage("❌ Error de conexión con la API.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Subir Nueva Propiedad</h2>
      {message && <p className={`text-center ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Título" value={property.title} onChange={handleChange} required className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Descripción" value={property.description} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="number" name="price" placeholder="Precio" value={property.price} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="location" placeholder="Ubicación" value={property.location} onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="image_url" placeholder="URL de la Imagen" value={property.image_url} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Subiendo..." : "Subir Propiedad"}
        </button>
      </form>
    </div>
  );
}
