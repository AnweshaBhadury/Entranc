import { defineType, defineField } from "sanity";

export default defineType({
  name: "ProjectsSection",
  title: "Projects Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string", // plain string
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "object",
          name: "project",
          fields: [
            defineField({
              name: "status",
              title: "Status",
              type: "string", // plain string
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string", // plain string
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text", // plain text
            }),
            defineField({
              name: "partners",
              title: "Partners",
              type: "string", // plain string
            }),
            defineField({
              name: "Icon",
              title: "Icon",
              type: "image", // image or SVG
              options: { hotspot: true },
            }),
            defineField({
              name: "customContainerClass",
              title: "Container Class",
              type: "string",
            }),
            defineField({
              name: "partnerBgClass",
              title: "Partner Background Class",
              type: "string",
            }),
            defineField({
              name: "buttonPrimaryClass",
              title: "Primary Button Class",
              type: "string",
            }),
            defineField({
              name: "buttonSecondaryClass",
              title: "Secondary Button Class",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
});
