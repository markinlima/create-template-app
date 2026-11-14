/** The pattern the release pipeline accepts: `<projectId>-vX.Y.Z` for a final release and `<projectId>-vX.Y.Z-rcN` for a candidate. */
export const TAG_PATTERN =
  /^[a-z0-9]+(-[a-z0-9]+)*-v[0-9]+\.[0-9]+\.[0-9]+(-rc[0-9]+)?$/;

export type ReleaseKind = "rc" | "final";

export interface ParsedTag {
  projectId: string;
  major: number;
  minor: number;
  patch: number;
  /** Only a release candidate has it. */
  rc?: number;
}

export function parseTag(tag: string): ParsedTag | null {
  const match = tag.match(/^(.+)-v(\d+)\.(\d+)\.(\d+)(?:-rc(\d+))?$/);

  if (!match?.[1]) {
    return null;
  }

  return {
    projectId: match[1],
    major: Number(match[2]),
    minor: Number(match[3]),
    patch: Number(match[4]),
    rc: match[5] === undefined ? undefined : Number(match[5]),
  };
}

export function formatVersion({
  major,
  minor,
  patch,
}: Pick<ParsedTag, "major" | "minor" | "patch">) {
  return `${major}.${minor}.${patch}`;
}

export function formatTag(projectId: string, version: string, rc?: number) {
  return `${projectId}-v${version}${rc === undefined ? "" : `-rc${rc}`}`;
}

/** Orders two tags of one project, oldest first. A release candidate comes before the final release of the same version. */
export function compareTags(a: ParsedTag, b: ParsedTag) {
  return (
    a.major - b.major ||
    a.minor - b.minor ||
    a.patch - b.patch ||
    (a.rc ?? Number.POSITIVE_INFINITY) - (b.rc ?? Number.POSITIVE_INFINITY)
  );
}

/** The newest tag of a project, or `null` when it has none. */
export function latestTag(tags: string[], projectId: string) {
  const parsed = tags
    .map((tag) => ({ tag, parsed: parseTag(tag) }))
    .filter(
      (entry): entry is { tag: string; parsed: ParsedTag } =>
        entry.parsed?.projectId === projectId,
    );

  parsed.sort((a, b) => compareTags(a.parsed, b.parsed));

  return parsed.at(-1) ?? null;
}

/** The number of the next release candidate of a version: `rc1` when it has none yet. */
export function nextRc(tags: string[], projectId: string, version: string) {
  const numbers = tags
    .map(parseTag)
    .filter(
      (tag): tag is ParsedTag =>
        tag?.projectId === projectId &&
        formatVersion(tag) === version &&
        tag.rc !== undefined,
    )
    .map((tag) => tag.rc as number);

  return Math.max(0, ...numbers) + 1;
}

export type Bump = "major" | "minor" | "patch";

/** What the commits since the last tag ask for, by Conventional Commits: a breaking change is a major, a `feat` a minor, the rest a patch. */
export function suggestBump(subjects: string[]): Bump {
  if (
    subjects.some(
      (subject) =>
        /^[a-z]+(\([^)]*\))?!:/.test(subject) ||
        subject.includes("BREAKING CHANGE"),
    )
  ) {
    return "major";
  }

  return subjects.some((subject) => /^feat(\(|:|!)/.test(subject))
    ? "minor"
    : "patch";
}

export function applyBump(
  version: Pick<ParsedTag, "major" | "minor" | "patch">,
  bump: Bump,
) {
  if (bump === "major") {
    return `${version.major + 1}.0.0`;
  }

  return bump === "minor"
    ? `${version.major}.${version.minor + 1}.0`
    : `${version.major}.${version.minor}.${version.patch + 1}`;
}

export interface ValidateTagOptions {
  tag: string;
  kind: ReleaseKind;
  existingTags: string[];
}

/** What is wrong with a tag before it is created. Empty when it can be used. */
export function validateTag({ tag, kind, existingTags }: ValidateTagOptions) {
  const errors: string[] = [];

  if (!TAG_PATTERN.test(tag)) {
    errors.push(
      `"${tag}" does not match <projectId>-vX.Y.Z or <projectId>-vX.Y.Z-rcN`,
    );
  }

  const isRc = parseTag(tag)?.rc !== undefined;

  if (kind === "rc" && !isRc) {
    errors.push("a release candidate needs -rcN in its tag");
  }

  if (kind === "final" && isRc) {
    errors.push("a final release must not have -rcN in its tag");
  }

  if (existingTags.includes(tag)) {
    errors.push(`the tag "${tag}" already exists`);
  }

  return errors;
}
