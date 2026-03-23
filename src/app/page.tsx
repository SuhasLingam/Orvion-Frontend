import Hero from "~/components/Hero";
import Programs from "~/components/Programs";
import Internships from "~/components/Internships";
import HowItWorks from "~/components/HowItWorks";
import RealResults from "~/components/RealResults";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Programs />
      <Internships />
      <HowItWorks />
      <RealResults />
    </div>
  );
}
