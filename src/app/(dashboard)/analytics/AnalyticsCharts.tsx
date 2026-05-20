"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

interface Props {
  trend: { date: string; score: number }[];
  domainData: { domain: string; fullDomain: string; score: number }[];
  weakAreas: { label: string; pct: number; priority: string }[];
  radarData: { subject: string; score: number; fullMark: number }[];
  sessions: {
    date: string; cert: string; categories: string;
    questions: number; score: number; time: string;
    avgTimeSec: number | null;
  }[];
}

export default function AnalyticsCharts({ trend, domainData, weakAreas, radarData, sessions }: Props) {
  const latestDelta = trend.length >= 2
    ? trend[trend.length - 1].score - trend[0].score
    : 0;

  const efficiencyData = sessions
    .filter((s) => s.avgTimeSec !== null && s.avgTimeSec > 0)
    .map((s) => ({ x: s.avgTimeSec as number, y: s.score, label: s.date }));

  return (
    <>
      {/* Readiness trend */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-foreground">Readiness Trend</p>
            <p className="text-xs text-muted mt-0.5">All sessions</p>
          </div>
          {latestDelta !== 0 && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${latestDelta > 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
              <span className={`text-xs font-semibold ${latestDelta > 0 ? "text-emerald-700" : "text-red-600"}`}>
                {latestDelta > 0 ? "+" : ""}{latestDelta}% overall
              </span>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 12 }}
              formatter={(v) => [`${v}%`, "Score"]}
            />
            <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: "Ready", fontSize: 10, fill: "#10b981" }} />
            <Line type="monotone" dataKey="score" stroke="#6d28d9" strokeWidth={2.5}
              dot={{ fill: "#6d28d9", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Radar + Domain bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {radarData.length >= 3 && (
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-1">Skill Radar</p>
            <p className="text-xs text-muted mb-4">Accuracy across all domains</p>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <Radar name="Score" dataKey="score" stroke="#6d28d9" fill="#6d28d9" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, "Accuracy"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {domainData.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-6">Score by Domain</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={domainData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="domain" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 12 }}
                  formatter={(v, _n, props) => [`${v}%`, props.payload.fullDomain]}
                />
                <ReferenceLine y={72} stroke="#10b981" strokeDasharray="4 4" />
                <Bar dataKey="score" fill="#6d28d9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Time efficiency + Weak areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {efficiencyData.length >= 2 && (
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-1">Time Efficiency</p>
            <p className="text-xs text-muted mb-4">Speed vs. accuracy — faster + higher is better</p>
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  type="number" dataKey="x" name="Avg sec/q"
                  tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false}
                  label={{ value: "Avg seconds / question", position: "insideBottom", offset: -12, fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  type="number" dataKey="y" name="Score" domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 12, fontSize: 12 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any, name: any) => [`${v}${name === "Score" ? "%" : "s"}`, name]}
                />
                <Scatter data={efficiencyData} fill="#6d28d9" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {weakAreas.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-5">Areas to Focus</p>
            <div className="flex flex-col gap-4">
              {weakAreas.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-foreground">{item.label}</span>
                      <span className="text-xs font-semibold text-muted">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.pct < 60 ? "bg-red-400" : item.pct < 70 ? "bg-amber-400" : "bg-brand-600"}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    item.priority === "High" ? "bg-red-50 text-red-600" :
                    item.priority === "Medium" ? "bg-amber-50 text-amber-600" :
                    "bg-emerald-50 text-emerald-600"
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session history */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Session History</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Date", "Certification", "Topics", "Questions", "Score", "Time"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-muted pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 text-xs text-muted">{s.date}</td>
                  <td className="py-3 pr-4 text-xs font-medium text-foreground">{s.cert}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{s.categories}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{s.questions}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-bold ${s.score >= 72 ? "text-emerald-600" : "text-red-500"}`}>
                      {s.score}%
                    </span>
                  </td>
                  <td className="py-3 text-xs text-muted">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
