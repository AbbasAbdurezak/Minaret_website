import { z } from "zod";

const ProjectStatusSchema = z.enum(["Finishing", "Ongoing", "Planning"]);

const ProjectSpecSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(200)
});

const ProjectSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-_]+$/i, "Slug must be URL-safe (letters, numbers, dashes, underscores)."),
  name: z.string().trim().min(1).max(100),
  location: z.string().trim().min(1).max(150),
  status: ProjectStatusSchema,
  image: z.string().trim().max(500),
  summary: z.string().trim().max(1000),
  specs: z.array(ProjectSpecSchema).max(50),
  gallery: z.array(z.string().trim().max(500)).max(50)
});

const SiteConfigSchema = z.object({
  name: z.string().trim().min(1).max(100),
  tagline: z.string().trim().max(300),
  description: z.string().trim().max(5000),
  phonePrimary: z.string().trim().max(40),
  phoneSecondary: z.string().trim().max(40),
  email: z.string().trim().email().max(254),
  logo: z.string().trim().max(500)
});

const ApartmentTypeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  locations: z.array(z.string().trim().max(100)).max(50),
  status: ProjectStatusSchema,
  totalArea: z.string().trim().max(50),
  features: z.array(z.string().trim().max(100)).max(50)
});

const SisterCompanySchema = z.object({
  name: z.string().trim().min(1).max(100),
  discipline: z.string().trim().max(100),
  description: z.string().trim().max(1000)
});

const TestimonialSchema = z.object({
  quote: z.string().trim().min(1).max(1000),
  name: z.string().trim().min(1).max(100),
  role: z.string().trim().max(100)
});

const StatSchema = z.object({
  label: z.string().trim().min(1).max(100),
  value: z.string().trim().min(1).max(50)
});

const ServiceSchema = z.object({
  title: z.string().trim().min(1).max(150),
  body: z.string().trim().min(1).max(1000)
});

const BlogPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(1000)
});

const GalleryImageSchema = z.object({
  src: z.string().trim().max(500),
  alt: z.string().trim().max(200),
  projectSlug: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50)
});

const GallerySchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(1000),
  images: z.array(GalleryImageSchema).max(500)
});

export const SiteContentSchema = z.object({
  siteConfig: SiteConfigSchema,
  projects: z.array(ProjectSchema).max(200),
  apartmentTypes: z.array(ApartmentTypeSchema).max(200),
  sisterCompanies: z.array(SisterCompanySchema).max(200),
  testimonials: z.array(TestimonialSchema).max(200),
  stats: z.array(StatSchema).max(100),
  services: z.array(ServiceSchema).max(100),
  blogPosts: z.array(BlogPostSchema).max(100),
  gallery: GallerySchema
}).strict();
