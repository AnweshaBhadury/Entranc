// ./schemas/AboutPageSchema/whyBehindUs.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "WhyBehindUs",
  title: "Why Behind Us Section",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label / Intro Text",
      type: "string",
      initialValue: "Community Energy Model",
      description: "Small text above the heading",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "The Why Behind Us",
      description: "Main heading of the section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Introductory paragraph under the heading",
    }),
    defineField({
      name: "cards",
      title: "Info Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "text" }),
          ],
        },
      ],
      description: "Optional info cards content",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description: "Images displayed in the grid",
      validation: (Rule) => Rule.max(2).warning("Add up to 2 images only"),
    }),
  ],
});
