export const projectType = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: "required"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: "required"
    },
    {
      name: "location",
      title: "Location",
      type: "string"
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Planning", "Ongoing", "Finishing"]
      }
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: { hotspot: true }
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }]
    },
    {
      name: "specs",
      title: "Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" }
          ]
        }
      ]
    }
  ]
};

export const blogPostType = {
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: "required"
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: "required"
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }]
    }
  ]
};

export const schemaTypes = [projectType, blogPostType];
