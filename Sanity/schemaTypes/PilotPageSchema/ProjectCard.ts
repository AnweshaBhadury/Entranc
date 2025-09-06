// ./schemas/PilotPageSchema/ProjectCard.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "ProjectCard",
  title: "Project Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string", // multilingual automatically via plugin
    }),
    defineField({
      name: "description",
      title: "Project Description",
      type: "text", // multilingual automatically via plugin
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
    }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "text",
    }),
    defineField({
      name: "customContainerClass",
      title: "Custom Container Class",
      type: "string",
    }),
    defineField({
      name: "partnerBgClass",
      title: "Partners Background Class",
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
    defineField({
      name: "Icon",
      title: "Optional Icon Component",
      type: "string",
    }),
  ],
});
