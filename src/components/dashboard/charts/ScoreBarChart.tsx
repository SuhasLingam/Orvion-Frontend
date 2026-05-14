"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  data: { topic: string; score: number }[];
  threshold?: number;
}

export default function ScoreBarChart({ data, threshold = 60 }: Props) {
  const normalized = data.map((d) => ({ topic: d.topic, pct: d.score }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={normalized} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="topic" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, color: "#1A202C", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any) => [`${v}%`, "Score"]}
        />
        <Bar dataKey="pct" radius={[6, 6, 0, 0]} maxBarSize={40}>
          {normalized.map((d, i) => (
            <Cell key={i} fill={d.pct < threshold ? "#EF4444" : "#305EFF"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
