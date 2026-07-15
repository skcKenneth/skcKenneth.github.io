const privateScienceProjectPattern = /^https:\/\/(?:www\.)?github\.com\/skcKenneth\/ScienceProject(?:\/|$)/i;

export const scienceProjectIsPrivate = true;

export function publicRepositoryUrl(value?: string | null): string | undefined {
  if (!value || privateScienceProjectPattern.test(value)) return undefined;
  return value;
}

