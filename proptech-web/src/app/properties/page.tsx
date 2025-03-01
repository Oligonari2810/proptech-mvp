import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Listado de Propiedades</h1>
      
      {/* 🔹 Botón para agregar propiedades */}
      <div className="mb-4">
        <Link href="/properties/add" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          ➕ Agregar Propiedad
        </Link>
      </div>

      <ul>
        <li>
          <Link href="/properties/1">
            <span className="text-blue-500 hover:underline">Propiedad 1</span>
          </Link>
        </li>
        <li>
          <Link href="/properties/2">
            <span className="text-blue-500 hover:underline">Propiedad 2</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
