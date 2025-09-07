// ./schemas/ProjectsSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "ProjectsSection",
  title: "Projects Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Projects",
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
            defineField({ name: "status", title: "Status", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "partners", title: "Partners", type: "string" }),
            defineField({
              name: "iconType",
              title: "Icon Type",
              type: "string",
              options: {
                list: [
                  { title: "FaWind", value: "FaWind" },
                  { title: "PowerBattery", value: "PowerBattery" },
                ],
              },
            }),
            defineField({
              name: "icon",
              title: "Icon / Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "customContainerClass", title: "Custom Container Class", type: "string" }),
            defineField({ name: "partnerBgClass", title: "Partner Background Class", type: "string" }),
            defineField({ name: "buttonPrimaryClass", title: "Primary Button Class", type: "string" }),
            defineField({ name: "buttonSecondaryClass", title: "Secondary Button Class", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).warning("Add at least one project"),
    }),
  ],
});
