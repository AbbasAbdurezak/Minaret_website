export type ProjectStatus = "Finishing" | "Ongoing" | "Planning";

export type Project = {
  slug: string;
  name: string;
  location: string;
  status: ProjectStatus;
  image: string;
  summary: string;
  specs: {
    label: string;
    value: string;
  }[];
  gallery: string[];
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  logo: string;
};

export type ApartmentType = {
  name: string;
  locations: string[];
  status: ProjectStatus;
  totalArea: string;
  features: string[];
};

export type SisterCompany = {
  name: string;
  description: string;
  discipline: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type SiteContent = {
  siteConfig: SiteConfig;
  projects: Project[];
  apartmentTypes: ApartmentType[];
  sisterCompanies: SisterCompany[];
  testimonials: Testimonial[];
  stats: {
    label: string;
    value: string;
  }[];
  services: {
    title: string;
    body: string;
  }[];
  blogPosts: {
    title: string;
    excerpt: string;
  }[];
  gallery: {
    title: string;
    description: string;
    images: {
      src: string;
      alt: string;
      projectSlug?: string;
      category: string;
    }[];
  };
};
