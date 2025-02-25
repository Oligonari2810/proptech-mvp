import Image from "next/image";

const Banner = () => (
  <Image
    className="my-8"
    src="/images/Banner.jpg"
    alt="Banner de HábitatProRD"
    width={800}
    height={400}
    priority
  />
);

export default Banner;
