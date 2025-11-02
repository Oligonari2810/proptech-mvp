// Datos para megamenús de navegación

export interface MegamenuItem {
  name: string;
  href: string;
  count?: string;
  featured?: boolean;
  trending?: boolean;
}

export interface MegamenuCategory {
  title: string;
  links: MegamenuItem[];
}

export interface MegamenuConfig {
  featuredItems: MegamenuItem[];
  categories: MegamenuCategory[];
  tools: MegamenuCategory[];
}

export const compraMegamenu: MegamenuConfig = {
  featuredItems: [
    {
      name: "Casas en Santo Domingo",
      href: "/comprar?type=casa&location=santo-domingo",
      count: "245 disponibles",
      trending: true
    },
    {
      name: "Apartamentos Premium",
      href: "/comprar?type=apartamento&category=premium",
      count: "89 disponibles",
      featured: true
    },
    {
      name: "Terrenos para Inversión",
      href: "/comprar?type=terreno&category=inversion",
      count: "34 disponibles"
    }
  ],
  categories: [
    {
      title: "Tipos de Propiedad",
      links: [
        { name: "Casas", href: "/comprar?type=casa", count: "342" },
        { name: "Apartamentos", href: "/comprar?type=apartamento", count: "189" },
        { name: "Terrenos", href: "/comprar?type=terreno", count: "76" },
        { name: "Locales Comerciales", href: "/comprar?type=local", count: "45" },
        { name: "Villas", href: "/comprar?type=villa", count: "28" },
        { name: "Condominios", href: "/comprar?type=condominio", count: "12" }
      ]
    },
    {
      title: "Zonas Populares",
      links: [
        { name: "Santo Domingo Este", href: "/comprar?location=santo-domingo-este" },
        { name: "Punta Cana", href: "/comprar?location=punta-cana" },
        { name: "Santiago", href: "/comprar?location=santiago" },
        { name: "La Romana", href: "/comprar?location=la-romana" },
        { name: "Bávaro", href: "/comprar?location=bavaro" },
        { name: "Boca Chica", href: "/comprar?location=boca-chica" }
      ]
    }
  ],
  tools: [
    {
      title: "Herramientas",
      links: [
        { name: "🧮 Calculadora de Impuestos", href: "/calculadora-impuestos" },
        { name: "📊 Calculadora Hipotecaria", href: "/calculadora-hipotecaria" },
        { name: "📋 Asistente de Trámites", href: "/tramites-inmobiliarios" },
        { name: "⚖️ Leyes Inmobiliarias", href: "/leyes-inmobiliarias" }
      ]
    }
  ]
};

export const alquilerMegamenu: MegamenuConfig = {
  featuredItems: [
    {
      name: "Apartamentos en Zona Colonial",
      href: "/alquilar?location=zona-colonial",
      count: "156 disponibles",
      trending: true
    },
    {
      name: "Casas con Piscina",
      href: "/alquilar?feature=piscina",
      count: "78 disponibles",
      featured: true
    }
  ],
  categories: [
    {
      title: "Tipos de Alquiler",
      links: [
        { name: "Apartamentos", href: "/alquilar?type=apartamento", count: "342" },
        { name: "Casas", href: "/alquilar?type=casa", count: "189" },
        { name: "Estudios", href: "/alquilar?type=estudio", count: "76" },
        { name: "Habitaciones", href: "/alquilar?type=habitacion", count: "45" }
      ]
    },
    {
      title: "Zonas Populares",
      links: [
        { name: "Santo Domingo Centro", href: "/alquilar?location=santo-domingo-centro" },
        { name: "Piantini", href: "/alquilar?location=piantini" },
        { name: "Naco", href: "/alquilar?location=naco" },
        { name: "Bella Vista", href: "/alquilar?location=bella-vista" }
      ]
    }
  ],
  tools: [
    {
      title: "Herramientas",
      links: [
        { name: "🧮 Calculadora de Impuestos", href: "/calculadora-impuestos" },
        { name: "📋 Asistente de Trámites", href: "/tramites-inmobiliarios" }
      ]
    }
  ]
};

export const venderMegamenu: MegamenuConfig = {
  featuredItems: [
    {
      name: "Publicar Propiedad Gratis",
      href: "/vender",
      featured: true
    },
    {
      name: "Solicitar Valoración",
      href: "/valorar",
      count: "Valoración instantánea"
    }
  ],
  categories: [
    {
      title: "Recursos para Vendedores",
      links: [
        { name: "Cómo Publicar", href: "/vender" },
        { name: "Valorar Mi Propiedad", href: "/valorar" },
        { name: "Tips de Venta", href: "/vender#tips" },
        { name: "Agentes Disponibles", href: "/vender#agentes" }
      ]
    },
    {
      title: "Herramientas",
      links: [
        { name: "Calculadora de Precio", href: "/valorar" },
        { name: "Comparador de Mercado", href: "/comprar#comparador" }
      ]
    }
  ],
  tools: [
    {
      title: "Ayuda",
      links: [
        { name: "📋 Asistente de Trámites", href: "/tramites-inmobiliarios" },
        { name: "⚖️ Leyes Inmobiliarias", href: "/leyes-inmobiliarias" },
        { name: "🏖️ Guía CONFOTUR", href: "/confotur" }
      ]
    }
  ]
};

