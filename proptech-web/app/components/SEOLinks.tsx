/**
 * Componente para Internal Linking SEO
 * Renderizado invisible pero accesible para crawlers
 */
export default function SEOLinks() {
  return (
    <div className="sr-only" aria-hidden="true">
      {/* Internal linking estratégico para SEO */}
      <nav>
        <ul className="flex flex-wrap gap-4">
          <li>
            <a href="/comprar" title="Comprar Propiedades República Dominicana">
              Comprar Propiedades República Dominicana
            </a>
          </li>
          <li>
            <a href="/alquilar" title="Alquiler Apartamentos República Dominicana">
              Alquiler Apartamentos República Dominicana
            </a>
          </li>
          <li>
            <a href="/vender" title="Vender Propiedad República Dominicana">
              Vender Propiedad República Dominicana
            </a>
          </li>
          <li>
            <a href="/invertir" title="Inversión Inmobiliaria República Dominicana">
              Inversión Inmobiliaria República Dominicana
            </a>
          </li>
          <li>
            <a href="/calculadora-hipotecaria" title="Calculadora Hipotecaria Bancos República Dominicana">
              Calculadora Hipotecaria Bancos República Dominicana
            </a>
          </li>
          <li>
            <a href="/calculadora-impuestos" title="Impuestos Propiedades República Dominicana">
              Impuestos Propiedades República Dominicana
            </a>
          </li>
          <li>
            <a href="/leyes-inmobiliarias" title="Leyes Inmobiliarias República Dominicana">
              Leyes Inmobiliarias República Dominicana
            </a>
          </li>
          <li>
            <a href="/tramites-inmobiliarios" title="Trámites Inmobiliarios República Dominicana">
              Trámites Inmobiliarios República Dominicana
            </a>
          </li>
          <li>
            <a href="/confotur" title="Guía CONFOTUR Inversión Extranjera República Dominicana">
              Guía CONFOTUR Inversión Extranjera República Dominicana
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

