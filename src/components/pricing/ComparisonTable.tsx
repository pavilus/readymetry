"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

type CellValue = boolean | string | null;

interface Row {
  feature: string;
  free: CellValue;
  single: CellValue;
  pack: CellValue;
  workforce: CellValue;
}

interface Section {
  category: string;
  rows: Row[];
}

const TABLE_DATA: Section[] = [
  {
    category: "Practice Exams",
    rows: [
      { feature: "Mock exam attempts", free: "1 free", single: "1 premium", pack: "5 full exams", workforce: "Unlimited" },
      { feature: "Timed simulation mode", free: false, single: true, pack: true, workforce: true },
      { feature: "Realistic question bank", free: true, single: true, pack: true, workforce: true },
      { feature: "Full answer explanations", free: false, single: true, pack: true, workforce: "Custom rollout" },
    ],
  },
  {
    category: "Analytics & Insights",
    rows: [
      { feature: "Basic score report", free: true, single: true, pack: true, workforce: true },
      { feature: "Readiness analytics", free: false, single: false, pack: true, workforce: true },
      { feature: "Pass probability score", free: false, single: false, pack: true, workforce: true },
      { feature: "Weak area analysis", free: false, single: false, pack: true, workforce: true },
      { feature: "Skill radar chart", free: false, single: false, pack: true, workforce: true },
      { feature: "Confidence tracking", free: false, single: false, pack: true, workforce: true },
      { feature: "Adaptive recommendations", free: false, single: false, pack: true, workforce: true },
    ],
  },
  {
    category: "Organization Access",
    rows: [
      { feature: "Self-serve team checkout", free: false, single: false, pack: false, workforce: true },
      { feature: "Team seat management", free: false, single: false, pack: false, workforce: true },
      { feature: "Invite members by email", free: false, single: false, pack: false, workforce: true },
    ],
  },
];

const COLUMNS = [
  { key: "free", label: "Free Trial", sub: "$0" },
  { key: "single", label: "Exam Credit", sub: "$39" },
  { key: "pack", label: "Readiness Pack", sub: "$99", highlight: true },
  { key: "workforce", label: "Workforce", sub: "5-25 seats" },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center text-brand-700">
        <Check size={16} strokeWidth={2.5} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center text-gray-300">
        <X size={14} strokeWidth={2} />
      </div>
    );
  }
  if (value === null) {
    return (
      <div className="flex justify-center text-gray-300">
        <Minus size={14} />
      </div>
    );
  }
  return (
    <span className={`text-xs font-medium ${highlight ? "text-purple-100" : "text-muted"}`}>
      {value}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            <th className="text-left pb-4 pr-6 w-[38%]">
              <span className="text-sm font-semibold text-foreground">Feature</span>
            </th>
            {COLUMNS.map((col) => (
              <th key={col.key} className="pb-4 px-2 text-center">
                <div className={`rounded-xl py-2 px-3 ${col.highlight ? "bg-brand-700 text-white" : ""}`}>
                  <p className={`text-sm font-bold ${col.highlight ? "text-white" : "text-foreground"}`}>{col.label}</p>
                  <p className={`text-xs mt-0.5 ${col.highlight ? "text-purple-200" : "text-muted"}`}>{col.sub}</p>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_DATA.map((section) => (
            <>
              <tr key={`section-${section.category}`}>
                <td colSpan={5} className="pt-6 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{section.category}</span>
                </td>
              </tr>
              {section.rows.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border/50 hover:bg-[#FAFAFC] transition-colors"
                >
                  <td className="py-3 pr-6 text-sm text-foreground">{row.feature}</td>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-2 text-center align-middle ${col.highlight ? "bg-brand-700/5" : ""}`}
                    >
                      <Cell value={row[col.key as keyof Row] as CellValue} highlight={col.highlight} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
