import { notFound } from "next/navigation";
import { getProgramById, programs } from "~/data/programs";
import InternshipHero from "~/components/program/InternshipHero";
import ProgramTechnologies from "~/components/program/ProgramTechnologies";
import ProgramOutcomes from "~/components/program/ProgramOutcomes";
import ProgramProjects from "~/components/program/ProgramProjects";
import InternshipFeatures from "~/components/program/InternshipFeatures";
import RealResults from "~/components/RealResults";

export function generateStaticParams() {
  return programs.map((p) => ({ id: p.id }));
}

export default async function InternshipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) notFound();

  return (
    <div className="w-full">
      <InternshipHero program={program} />
      <ProgramOutcomes outcomes={program.responsibilities} title="Key Responsibilities" />
      <ProgramTechnologies technologies={program.technologies} />
      <ProgramOutcomes outcomes={program.outcomes} title="Learning Outcomes" />
      
      {/* Expose the projects framework since internships are highly project-based */}
      {program.projectsFramework && <ProgramProjects framework={program.projectsFramework} />}
      
      <InternshipFeatures />
      <RealResults />
    </div>
  );
}
