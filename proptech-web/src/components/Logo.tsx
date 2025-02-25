import Image from "next/image";

const Logo = () => (
  <Image
    className="dark:invert"
    src="/images/Logo.png"
    alt="Logo de HábitatProRD"
    width={180}
    height={38}
    priority
  />
);

export default Logo;
