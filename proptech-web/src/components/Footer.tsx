import Link from "next/link";

const Footer = () => (
  <footer className="flex gap-6 flex-wrap items-center justify-center mt-10">
    <Link href="/about" className="text-blue-500 hover:underline">Acerca de HábitatProRD</Link>
    <Link href="/contact" className="text-blue-500 hover:underline">Contáctanos</Link>
    <Link href="/guide" className="text-blue-500 hover:underline">Guía de Inversión</Link>
  </footer>
);

export default Footer;
