export const defaultMetadata = {
  title: "HabitatPro RD - Propiedades Premium en República Dominicana",
  description: "Encuentra tu propiedad ideal con valoración inteligente HabitaScore. Apartamentos, casas y villas en Punta Cana, Santo Domingo y más.",
  keywords: "propiedades, bienes raíces, república dominicana, punta cana, apartamentos, casas, habitatpro",
}

export const generateMetadata = (pageMetadata: { title?: string; description?: string } = {}) => {
  return {
    title: pageMetadata.title ? `${pageMetadata.title} | HabitatPro RD` : defaultMetadata.title,
    description: pageMetadata.description || defaultMetadata.description,
    keywords: defaultMetadata.keywords,
    openGraph: {
      title: pageMetadata.title ? `${pageMetadata.title} | HabitatPro RD` : defaultMetadata.title,
      description: pageMetadata.description || defaultMetadata.description,
      type: 'website',
      locale: 'es_DO',
      siteName: 'HabitatPro RD',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMetadata.title ? `${pageMetadata.title} | HabitatPro RD` : defaultMetadata.title,
      description: pageMetadata.description || defaultMetadata.description,
    },
  }
}
