import Link from "next/link";

export default function PropertiesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Listado de Propiedades</h1>
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
