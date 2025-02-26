interface PropertyDetailProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PropertyDetailProps) {
  const { id } = params;
  return {
    title: `Detalles de la propiedad ${id}`,
    description: `Información sobre la propiedad con ID ${id}`,
  };
}

export default function PropertyDetail({ params }: PropertyDetailProps) {
  if (!params?.id) {
    return <div>Error: No se encontró la propiedad.</div>;
  }

  return <div>Detalles de la propiedad con ID: {params.id}</div>;
}
