import { notFound } from "next/navigation";
import { getProgramById, programs } from "~/data/programs";
import ProgramHero from "~/components/program/ProgramHero";
import ProgramTechnologies from "~/components/program/ProgramTechnologies";
import ProgramOutcomes from "~/components/program/ProgramOutcomes";
import ProgramCTA from "~/components/program/ProgramCTA";
import RealResults from "~/components/RealResults";

export function generateStaticParams() {
  return programs.map((p) => ({ id: p.id }));
}

export default async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) notFound();

  return (
    <div className="w-full">
      <ProgramHero program={program} />
      <ProgramTechnologies technologies={program.technologies} />
      <ProgramOutcomes outcomes={program.outcomes} />
      <ProgramCTA />
      <RealResults />
    </div>
  );
}
