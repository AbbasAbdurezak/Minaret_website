import type { ApartmentType, Project, SisterCompany, Testimonial } from "@/types";

export const siteConfig = {
  name: "Minaret Engineering",
  tagline: "Engineering landmarks. Developing lasting addresses.",
  description:
    "Minaret Engineering is an Ethiopia-based real estate and construction firm founded on trust, honesty, accountability, and reliability.",
  phonePrimary: "+251-902-464-748",
  phoneSecondary: "+251-114-625-351",
  email: "info@minaretrealstate.com",
  logo: "/assets/logo_try.png"
};

export const projects: Project[] = [
  {
    slug: "jemo",
    name: "Jemo",
    location: "Addis Ababa, Ethiopia",
    status: "Finishing",
    image: "/assets/site render (7).jpg",
    summary:
      "A refined residential address shaped around efficient plans, bright interiors, and elevated daily comfort.",
    specs: [
      { label: "Available plans", value: "129-205 sqm" },
      { label: "Project type", value: "Residential apartments" },
      { label: "Gallery assets", value: "27 site photos" }
    ],
    gallery: [
      "/assets/site photo (1).webp",
      "/assets/site photo (2).webp",
      "/assets/site photo (14).jpg",
      "/assets/site photo (23).jpg"
    ]
  },
  {
    slug: "anfo",
    name: "Anfo",
    location: "Addis Ababa, Ethiopia",
    status: "Ongoing",
    image: "/assets/site render (3).jpg",
    summary:
      "A developing residential project with practical apartment layouts and engineering-led delivery discipline.",
    specs: [
      { label: "Available plans", value: "87-129 sqm" },
      { label: "Project type", value: "Residential apartments" },
      { label: "Delivery focus", value: "Ongoing works" }
    ],
    gallery: [
      "/assets/site render (1).jpg",
      "/assets/site render (2).jpg",
      "/assets/site render (3).jpg",
      "/assets/site render (4).jpg"
    ]
  },
  {
    slug: "kera",
    name: "Kera",
    location: "Addis Ababa, Ethiopia",
    status: "Planning",
    image: "/assets/site render (10).jpg",
    summary:
      "A future-focused site reserved for premium residential concepts and careful construction planning.",
    specs: [
      { label: "Project phase", value: "Concept planning" },
      { label: "Project type", value: "Residential development" },
      { label: "Inquiry", value: "Open for early interest" }
    ],
    gallery: [
      "/assets/site render (5).jpg",
      "/assets/site render (6).jpg",
      "/assets/site render (8).jpg",
      "/assets/site render (9).jpg"
    ]
  }
];

export const apartmentTypes: ApartmentType[] = [
  {
    name: "Normal Apartment",
    locations: ["Anfo"],
    status: "Ongoing",
    totalArea: "87 sqm",
    features: [
      "Living and dining",
      "Master bedroom",
      "Master bath",
      "Bedroom",
      "Common bath",
      "Kitchen",
      "Corridor"
    ]
  },
  {
    name: "Luxurious Apartment",
    locations: ["Jemo", "Anfo"],
    status: "Finishing",
    totalArea: "129 sqm",
    features: [
      "Living and dining",
      "Master bedroom",
      "Master bath",
      "Bedroom 1",
      "Bedroom 2",
      "Common bath",
      "Store",
      "Kitchen",
      "Corridor"
    ]
  },
  {
    name: "Extra Luxurious Apartment",
    locations: ["Jemo"],
    status: "Finishing",
    totalArea: "205 sqm",
    features: [
      "Living and dining",
      "Master bedroom",
      "Master bath",
      "Bedroom 1",
      "Bedroom 2",
      "Bedroom 3",
      "Common bath",
      "Kitchen",
      "Store",
      "Corridor"
    ]
  }
];

export const sisterCompanies: SisterCompany[] = [
  {
    name: "Sister Company 1",
    discipline: "Development",
    description: "Placeholder company focused on property development and strategic land opportunities."
  },
  {
    name: "Sister Company 2",
    discipline: "Construction",
    description: "Placeholder company for construction delivery, supervision, and site operations."
  },
  {
    name: "Sister Company 3",
    discipline: "Consulting",
    description: "Placeholder company for engineering advisory, planning, and technical documentation."
  },
  {
    name: "Sister Company 4",
    discipline: "Interiors",
    description: "Placeholder company for interior finishing, procurement, and handover presentation."
  },
  {
    name: "Sister Company 5",
    discipline: "Investment",
    description: "Placeholder company for real estate investment, partnerships, and portfolio growth."
  }
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Minaret Engineering communicates clearly and treats the details of delivery with the seriousness a home deserves.",
    name: "Client Partner",
    role: "Residential buyer"
  },
  {
    quote:
      "The team combines architectural ambition with grounded construction discipline, which makes the process feel transparent.",
    name: "Project Stakeholder",
    role: "Development advisor"
  }
];

export const stats = [
  { label: "Core values", value: "4" },
  { label: "Featured projects", value: "3" },
  { label: "Sister companies", value: "5" },
  { label: "Apartment plans", value: "3" }
];
