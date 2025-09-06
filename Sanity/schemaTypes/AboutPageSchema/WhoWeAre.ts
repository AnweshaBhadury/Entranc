// ./schemas/AboutPageSchema/whoWeAre.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "WhoWeAre",
  title: "Who We Are Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Who We Are",
      description: "Main heading of the section",
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text" }],
      description: "Add one or more paragraphs describing the organization",
      validation: (Rule) => Rule.min(1).warning("Add at least one paragraph"),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Optional icon for visual decoration (e.g., lightbulb)",
      options: { hotspot: true },
    }),
  ],
});
