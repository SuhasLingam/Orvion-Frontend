"use client";

const INTENSITY = ["#F1F5F9", "#DBEAFE", "#60A5FA", "#305EFF", "#1E3A8A"];

interface Day { date: string; count: number }
interface Props { data: Day[] }

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HeatmapGrid({ data }: Props) {
  const first = data[0] ? new Date(data[0].date) : new Date();
  const startPad = first.getDay();
  const padded: (Day | null)[] = [
    ...Array.from<Day | null>({ length: startPad }).fill(null),
    ...data,
  ];

  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-1.5 min-w-0">
        <div className="flex flex-col gap-1.5 mr-2 pt-5">
          {DAYS.map((d) => (
            <div key={d} className="h-3.5 text-[10px] font-bold text-[#94A3B8] leading-3 w-7">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day, di) => {
              const idx = day ? Math.min(day.count, 4) : -1;
              const bg: string = idx >= 0 ? (INTENSITY[idx] ?? "#F1F5F9") : "transparent";
              const title: string = day ? `${day.date}: ${String(day.count)} activities` : "";
              return (
                <div
                  key={di}
                  title={title}
                  className="w-3.5 h-3.5 rounded-sm transition-colors hover:ring-2 ring-[#305EFF] ring-offset-1"
                  style={{ backgroundColor: bg, border: idx === 0 ? "1px solid #E2E8F0" : "none" }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
        <span>Less</span>
        {INTENSITY.map((c, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c, border: i === 0 ? "1px solid #E2E8F0" : "none" }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
