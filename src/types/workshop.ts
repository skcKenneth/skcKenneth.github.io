export type WorkshopLocale = "en" | "zh-Hant";
export type Bilingual = { en: string; "zh-Hant": string };
export interface WorkshopStep { id: string; title: Bilingual; body: Bilingual; task: Bilingual; minutes: number; }
export interface WorkshopParameter { key: string; label: Bilingual; value: number | string; min?: number; max?: number; step?: number; options?: {value:string;label:Bilingual}[]; }
export interface WorkshopReference { book: string; chapter: string; pdfPages: string; printedPages: string; }
export interface WorkshopLesson {
  id: string; slug: string; version: string; number: string; title: Bilingual; question: Bilingual;
  summary: Bilingual; prerequisites: Bilingual; objectives: Bilingual[]; notes: string[];
  equation: string; steps: WorkshopStep[]; hints: Bilingual[]; parameters: WorkshopParameter[];
  comparison: Bilingual; failure: Bilingual; extension: Bilingual; interpretation: Bilingual;
  references: WorkshopReference[];
}
export interface WorkshopResult {
  slug: string; version: string; seed: number; params: Record<string, number | string>;
  data_type: string; metrics: Record<string, number>;
  checks: {en:string;zh:string;passed:boolean;detail:string}[];
  figures: {en:string;zh:string;png:string}[]; csv: string; frames?: number[][][];
}
export interface LearnerProgress {
  schemaVersion: 1; lessonId: string; lessonVersion: string; step: number;
  modelCard: Record<string,string>; answers: Record<string,string>; code: string;
  params: Record<string,number|string>; seed: number; completed: string[];
  prediction: string; reflection: string; updatedAt: string;
  lastRun?: { result: WorkshopResult; code: string; params: Record<string,number|string>; seed: number; at: string; stale: boolean };
}
