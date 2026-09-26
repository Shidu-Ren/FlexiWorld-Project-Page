import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const source = path.resolve(process.argv[2] || "../Odessey-Jepa");
const root = path.resolve(import.meta.dirname, "..");
const assets = path.join(root, "assets");
const gallery = path.join(source, "output/FlexiWorld-Supplement");
const manifest = JSON.parse(
  fs.readFileSync(path.join(gallery, "manifest.json")),
);
const sha = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const provenance = {
  manuscriptCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: source })
    .toString()
    .trim(),
  files: {},
};
function copy(from, to) {
  const dest = path.join(assets, to);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(from, dest);
  provenance.files[to] = sha(dest);
}

// Preserve the actual recorded frames. No synthesized trajectories or retimed media.
const tasks = manifest.tasks.map((task) => ({
  id: task.id,
  name: task.name,
  cases: task.cases.map((c) => {
    for (const m of c.methods) {
      if (sha(path.join(gallery, m.video)) !== m.video_sha256)
        throw new Error(`Video hash mismatch: ${m.video}`);
      for (const field of ["video", "poster", "final_frame"])
        copy(path.join(gallery, m[field]), m[field]);
    }
    if (c.expert)
      for (const field of ["video", "poster"])
        copy(path.join(gallery, c.expert[field]), c.expert[field]);
    copy(path.join(gallery, c.goal), c.goal);
    return {
      id: c.id,
      distance: c.distance,
      fps: c.fps,
      episode: c.episode,
      start: c.start,
      trainingSeed: c.training_seed,
      evaluationSeed: c.evaluation_seed,
      category: c.category,
      goal: c.goal,
      description: c.description,
      methods: c.methods.map((m) => ({
        id: m.id,
        label: m.label,
        video: m.video,
        poster: m.poster,
        firstSuccess: m.first_success,
        success: m.final_success,
      })),
      expert: c.expert
        ? { video: c.expert.video, poster: c.expert.poster }
        : null,
    };
  }),
}));
for (const [file, name] of [
  ["figures/odyssey-training.png", "training.png"],
  ["figures/odyssey-arcem.png", "arcem.png"],
  ["output/appendix-spacing/iclr2027_conference.pdf", "flexiworld-paper.pdf"],
  ["supplementary/gallery-template/lucide.min.js", "lucide.min.js"],
  ["supplementary/gallery-template/LUCIDE-LICENSE", "LUCIDE-LICENSE"],
])
  copy(path.join(source, file), name);
copy(path.join(gallery, "manifest.json"), "recording-manifest.json");

const numbers = (value) =>
  [...value.matchAll(/(?:\d+\.\d+)/g)].map((m) => Number(m[0]));
const table = fs.readFileSync(
  path.join(source, "tables/main_results.tex"),
  "utf8",
);
const results = table
  .split("\n")
  .filter((l) => l.includes("& $"))
  .map((l) => {
    const cells = l.split("&");
    const label = cells[0].replace(/\\textbf\{([^}]+)\}/g, "$1").trim();
    return {
      label,
      values: cells.slice(1).map((c) => {
        const [mean, sd] = numbers(c);
        return { mean, sd };
      }),
    };
  });
const planners = fs
  .readFileSync(path.join(source, "tables/planner_comparison.tex"), "utf8")
  .split("\n")
  .filter((l) => l.trim().startsWith("&"))
  .slice(-3)
  .map((l) => {
    const cells = l.split("&");
    return {
      label: `FlexiWorld ${cells[1].replace(/\\textbf\{([^}]+)\}/g, "$1").trim()}`,
      values: cells.slice(2).map((c) => {
        const [mean, sd] = numbers(c);
        return { mean, sd };
      }),
    };
  });
const latency = fs
  .readFileSync(path.join(source, "tables/chunk_latency.tex"), "utf8")
  .split("\n")
  .filter((l) => l.startsWith("ARCEM &"))
  .map((l) => {
    const c = l.split("&");
    return {
      distance: Number(c[1]),
      sr5: numbers(c[2])[0],
      sr10: numbers(c[3])[0],
      ms5: Number(c[4]),
      ms10: Number(c[5]),
    };
  });
if (results.length !== 6 || planners.length !== 3 || latency.length !== 4)
  throw new Error("Unexpected paper table structure");
if (
  results.some(
    (r) =>
      r.values.length !== 5 ||
      r.values.some((v) => !Number.isFinite(v.mean) || !Number.isFinite(v.sd)),
  )
)
  throw new Error("Invalid results");
const data = {
  tasks,
  results,
  planners,
  latency,
  protocol: {
    distances: [25, 50, 75, 100],
    trainingSeeds: [0, 42, 3072],
    evaluationSeeds: [0, 1, 42],
    episodesPerCell: 100,
    baselineTrainingCheckpoints: 1,
  },
  provenance: { manuscriptCommit: provenance.manuscriptCommit },
};
fs.writeFileSync(
  path.join(assets, "research-data.js"),
  `window.RESEARCH_DATA = ${JSON.stringify(data, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(assets, "results.json"),
  JSON.stringify(data, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(assets, "provenance.json"),
  JSON.stringify(provenance, null, 2) + "\n",
);
console.log(
  `Prepared ${tasks.length} tasks, ${tasks.reduce((n, t) => n + t.cases.length, 0)} verified cases, ${results.length} methods.`,
);
