import { notFound } from "next/navigation";
import { getProgramById, programs } from "~/data/programs";
import LearnPage from "~/components/program/LearnPage";

export function generateStaticParams() {
  return programs.map((p) => ({ id: p.id }));
}

export default async function ProgramLearnRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) notFound();

  return <LearnPage program={program} />;
}
