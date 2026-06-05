import fs from "node:fs";

const migrationFiles = fs.readdirSync("supabase/migrations")
  .filter((file) => file.endsWith(".sql"));
const files = migrationFiles
  .map((file) => fs.readFileSync(`supabase/migrations/${file}`, "utf8"))
  .join("\n");

const counts = new Map();
const difficulty = new Map();
let total = 0;
let inQuestion = false;
for (const line of files.split("\n")) {
  const questionStart = line.match(/^\(cwi_id,\s*'([^']+)'/);
  if (questionStart) {
    inQuestion = true;
    total += 1;
    counts.set(questionStart[1], (counts.get(questionStart[1]) ?? 0) + 1);
  }
  if (!inQuestion) continue;
  const level = line.match(/^\s*'(easy|medium|hard)',/);
  if (level) difficulty.set(level[1], (difficulty.get(level[1]) ?? 0) + 1);
  if (/^\s*'[^']*'(?:,\s*'[^']*')*\);?$/.test(line)) inQuestion = false;
}

console.log(`AWS CWI authored SQL questions: ${total}`);
console.log("\nBy category");
for (const [category, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`${String(count).padStart(4)}  ${category}`);
}
console.log("\nBy difficulty");
for (const [level, count] of [...difficulty]) console.log(`${String(count).padStart(4)}  ${level}`);
console.log(`\nRemaining to first 500-question milestone: ${Math.max(0, 500 - total)}`);
