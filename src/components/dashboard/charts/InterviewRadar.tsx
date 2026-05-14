"use client";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Props {
  data: { subject: string; A: number; B?: number }[];
  labelA?: string;
  labelB?: string;
}

export default function InterviewRadar({ data, labelA = "Interview #1", labelB = "Interview #2" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#E2E8F0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }} />
        <Radar name={labelA} dataKey="A" stroke="#305EFF" fill="#305EFF" fillOpacity={0.25} strokeWidth={2} />
        {data[0]?.B !== undefined && (
          <Radar name={labelB} dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
        )}
        <Legend wrapperStyle={{ color: "#94A3B8", fontSize: 12, paddingTop: 12 }} />
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, color: "#1A202C", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
