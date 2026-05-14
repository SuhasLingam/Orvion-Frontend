"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { data: { week: string; xp: number }[] }

export default function XPLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="week" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, color: "#1A202C", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          itemStyle={{ color: "#305EFF", fontWeight: "bold" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any) => [`${v} XP`, "XP Earned"]}
        />
        <Line type="monotone" dataKey="xp" stroke="#305EFF" strokeWidth={3} dot={{ fill: "#FFFFFF", stroke: "#305EFF", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#305EFF" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
