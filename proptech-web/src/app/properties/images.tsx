"use client";

const PropertyImages = () => {
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      <img 
        src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741550991/casa_k9z13f.jpg" 
        alt="Casa" 
        width={300} 
        height={200} 
      />
      <img 
        src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741552606/apartamento_g9l9r5.webp" 
        alt="Apartamento" 
        width={300} 
        height={200} 
      />
      <img 
        src="https://res.cloudinary.com/dvbdg1pex/image/upload/v1741550176/apartamento.jpg" 
        alt="Comercial" 
        width={300} 
        height={200} 
      />
    </div>
  );
};

export default PropertyImages;
