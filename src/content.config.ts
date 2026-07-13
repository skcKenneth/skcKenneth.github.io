import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const loader = (base: string) => glob({ pattern: "**/*.{md,mdx}", base });
const status = z.enum(["Concept", "Exploratory study", "Prototype", "Reproducible study", "Manuscript in preparation", "Submitted", "Published", "Teaching case", "Archived"]);
const base = { title: z.string(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), summary: z.string().min(20), date: z.coerce.date().optional(), lastUpdated: z.coerce.date(), featured: z.boolean().default(false), topics: z.array(z.string()).default([]), heroImage: z.string().optional(), draft: z.boolean().default(false) };

const projects = defineCollection({ loader: loader("./src/content/projects"), schema: z.object({
  ...base, year: z.number().int(), status, methods: z.array(z.string()).default([]), researchQuestion: z.string(), dataType: z.string().optional(),
  codeAvailable: z.boolean().default(false), dataAvailable: z.boolean().default(false), studentSuitable: z.boolean().default(false),
  projectUrl: z.url().optional(), technicalUrl: z.url().optional(), repositoryUrl: z.url().optional(), paperUrl: z.url().optional(), teachingUrl: z.url().optional(),
  limitations: z.array(z.string()).default([]), keyFindings: z.array(z.string()).default([]), validation: z.string().optional(), period: z.coerce.string().optional(), redirectFrom: z.array(z.string()).default([])
}) });
const research = defineCollection({ loader: loader("./src/content/research"), schema: z.object({ ...base, programme: z.string(), methods: z.array(z.string()).default([]), questions: z.array(z.string()).default([]) }) });
const writing = defineCollection({ loader: loader("./src/content/writing"), schema: z.object({
  ...base, type: z.enum(["Research Notes", "Technical Tutorials", "Competition Case Studies", "Teaching Notes", "Mathematical Curiosities", "Archive"]), archived: z.boolean().default(false), redirectFrom: z.array(z.string()).default([]),
  scienceProject: z.string().optional(), technicalRepository: z.url().optional(), notebookUrl: z.url().optional(), codeUrl: z.url().optional(), reproductionUrl: z.url().optional(), technicalUrl: z.url().optional()
}) });
const teaching = defineCollection({ loader: loader("./src/content/teaching"), schema: z.object({ ...base, level: z.enum(["Beginner", "Competition", "Advanced", "Instructor"]), resourceType: z.enum(["Course pathway", "Python lab", "Worked example", "Instructor resource", "Student research"]), downloadUrl: z.string().optional() }) });
export const collections = { projects, research, writing, teaching };
