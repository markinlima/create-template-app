const SECTIONS: { title: string; types: string[] }[] = [
  { title: "Features", types: ["feat"] },
  { title: "Fixes", types: ["fix"] },
  { title: "Performance", types: ["perf"] },
  { title: "Refactors", types: ["refactor"] },
  { title: "Tests and build", types: ["test", "build", "ci"] },
  { title: "Docs and chores", types: ["docs", "chore", "style", "revert"] },
];

/** `fix(web): keep it inline` becomes `web: keep it inline`; a subject without a scope loses only the type. */
function describe(subject: string) {
  const match = subject.match(/^([a-z]+)(?:\(([^)]*)\))?!?:\s*(.+)$/);

  if (!match) {
    return { type: "", text: subject };
  }

  return {
    type: match[1] ?? "",
    text: match[2] ? `${match[2]}: ${match[3]}` : (match[3] ?? subject),
  };
}

/** The notes of a release, from the subjects of its commits, grouped by type. Nothing is invented: a subject that is not Conventional goes under "Other". */
export function buildReleaseNotes(subjects: string[]) {
  const described = subjects.map(describe);
  const blocks: string[] = [];

  for (const { title, types } of SECTIONS) {
    const lines = described
      .filter((entry) => types.includes(entry.type))
      .map((entry) => `- ${entry.text}`);

    if (lines.length > 0) {
      blocks.push(`## ${title}\n${lines.join("\n")}`);
    }
  }

  const known = SECTIONS.flatMap((section) => section.types);
  const others = described
    .filter((entry) => !known.includes(entry.type))
    .map((entry) => `- ${entry.text}`);

  if (others.length > 0) {
    blocks.push(`## Other\n${others.join("\n")}`);
  }

  return blocks.join("\n\n");
}
