import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const loader = (base: string) => glob({ pattern: "**/*.{md,mdx}", base });
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const status = z.enum([
  "Catalogue entry",
  "Concept",
  "Exploratory study",
  "Prototype",
  "Reproducible study",
  "Manuscript in preparation",
  "Submitted",
  "Published",
  "Teaching case",
  "Archived"
]);
const base = {
  title: z.string(),
  slug,
  summary: z.string().min(20),
  date: z.coerce.date().optional(),
  lastUpdated: z.coerce.date(),
  featured: z.boolean().default(false),
  topics: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  draft: z.boolean().default(false)
};

const projectSchema = z.object({
  ...base,
  year: z.number().int(),
  status,
  methods: z.array(z.string()).default([]),
  researchQuestion: z.string(),
  dataType: z.string().optional(),
  codeAvailable: z.boolean().default(false),
  dataAvailable: z.boolean().default(false),
  studentSuitable: z.boolean().default(false),
  projectUrl: z.url().optional(),
  technicalUrl: z.url().optional(),
  repositoryUrl: z.url().optional(),
  paperUrl: z.url().optional(),
  teachingUrl: z.url().optional(),
  limitations: z.array(z.string()).default([]),
  keyFindings: z.array(z.string()).default([]),
  validation: z.string().optional(),
  period: z.coerce.string().optional(),
  redirectFrom: z.array(z.string()).default([])
});

const researchSchema = z.object({
  ...base,
  programme: z.string(),
  methods: z.array(z.string()).default([]),
  questions: z.array(z.string()).default([])
});

const writingSchema = z.object({
  ...base,
  type: z.enum([
    "Research Notes",
    "Technical Tutorials",
    "Competition Case Studies",
    "Teaching Notes",
    "Mathematical Curiosities",
    "Archive",
    "研究筆記",
    "技術教程",
    "技術導讀",
    "競賽案例",
    "教學筆記",
    "教學札記",
    "數學趣題",
    "數學趣談",
    "文章庫",
    "文章典藏"
  ]),
  archived: z.boolean().default(false),
  readingMinutes: z.number().int().positive().optional(),
  redirectFrom: z.array(z.string()).default([]),
  scienceProject: z.string().optional(),
  technicalRepository: z.url().optional(),
  notebookUrl: z.url().optional(),
  codeUrl: z.url().optional(),
  reproductionUrl: z.url().optional(),
  technicalUrl: z.url().optional(),
  legacySource: z.string().optional()
});

const teachingSchema = z.object({
  ...base,
  level: z.enum(["Beginner", "Competition", "Advanced", "Instructor"]),
  resourceType: z.enum(["Course pathway", "Python lab", "Worked example", "Instructor resource", "Student research", "Competition archive"]),
  downloadUrl: z.string().optional()
});

const translated = { sourceSlug: slug };

export const collections = {
  projects: defineCollection({ loader: loader("./src/content/projects"), schema: projectSchema }),
  projectsZh: defineCollection({ loader: loader("./src/content/projects-zh"), schema: projectSchema.extend(translated) }),
  research: defineCollection({ loader: loader("./src/content/research"), schema: researchSchema }),
  researchZh: defineCollection({ loader: loader("./src/content/research-zh"), schema: researchSchema.extend(translated) }),
  writing: defineCollection({ loader: loader("./src/content/writing"), schema: writingSchema }),
  writingZh: defineCollection({ loader: loader("./src/content/writing-zh"), schema: writingSchema.extend(translated) }),
  teaching: defineCollection({ loader: loader("./src/content/teaching"), schema: teachingSchema }),
  teachingZh: defineCollection({ loader: loader("./src/content/teaching-zh"), schema: teachingSchema.extend(translated) })
};
