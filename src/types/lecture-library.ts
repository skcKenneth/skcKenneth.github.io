export type LectureLocale = "en" | "zh-Hant";
export type LectureGroup = "lecture" | "supplementary" | "writing";

export interface LocalizedText {
  en: string;
  "zh-Hant": string;
  zh_hant?: string;
}

export interface LocalizedList {
  en: string[];
  "zh-Hant": string[];
  zh_hant?: string[];
}

export interface LectureAsset {
  file: string;
  bytes: number;
  sha256: string;
  public_url: string;
  pages?: number;
  locale?: LectureLocale;
  document_type?: "notes" | "slides";
  watermarked?: boolean;
  title?: LocalizedText;
}

export interface LectureReadingReference {
  id: string;
  publisher: string;
  title: LocalizedText;
  url: string;
}

export interface LectureUnit {
  id: string;
  group: LectureGroup;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  prerequisites: LocalizedList;
  objectives: LocalizedList;
  duration_minutes: number;
  further_reading?: LectureReadingReference[];
  documents: {
    notes_en: LectureAsset;
    notes_zh_hant: LectureAsset;
    slides_en: LectureAsset;
  };
}

export interface LectureCatalogue {
  schema_version: 2;
  slug: string;
  revision_date: string;
  license: string | { name: string; url: string };
  units: LectureUnit[];
  collections: LectureAsset[];
  datasets: LectureAsset[];
}
