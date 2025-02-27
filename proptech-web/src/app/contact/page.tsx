"use client";

import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://proptech-mvp-1.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Mensaje enviado correctamente");
                setFormData({ name: "", email: "", message: "" });
            } else {
                alert("Error al enviar el mensaje");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h1 className="text-3xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg mb-6">Déjanos un mensaje y nuestro equipo te responderá lo antes posible.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mensaje"
                    required
                    className="w-full p-2 border border-gray-300 rounded h-32"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
}
