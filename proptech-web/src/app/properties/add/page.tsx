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
    images: "",
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
      ...property,
      price: parseFloat(property.price),
      images: [property.images]
    };

    const response = await fetch("https://proptech-mvp-1.onrender.com/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setMessage("Propiedad agregada exitosamente!");
      setTimeout(() => {
        router.push("/properties");
      }, 1500);
    } else {
      setMessage("Error al subir la propiedad.");
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
        <input type="text" name="images" placeholder="URL de la Imagen" value={property.images} onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Subiendo..." : "Subir Propiedad"}
        </button>
      </form>
    </div>
  );
}
