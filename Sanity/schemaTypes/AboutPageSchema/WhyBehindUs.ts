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
      type: "localeString",
      initialValue: "Community Energy Model",
      description: "Small text above the heading",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      initialValue: "The Why Behind Us",
      description: "Main heading of the section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
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
            defineField({ name: "localeText", title: "localeText", type: "localeText" }),
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
