import { defineType, defineField } from "sanity";

export default defineType({
  name: "Hero",
  title: "Hero Section",
  type: "object", // keep as object if embedded
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      description: "Main heading displayed in the hero section",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "localeText",
      description: "Optional subheading or tagline",
    }),
    defineField({
      name: "primaryButtonText",
      title: "Primary Button Text",
      type: "localeString",
    }),
    defineField({
      name: "primaryButtonLink",
      title: "Primary Button Link",
      type: "url",
    }),
    defineField({
      name: "secondaryButtonText",
      title: "Secondary Button Text",
      type: "localeString",
    }),
    defineField({
      name: "secondaryButtonLink",
      title: "Secondary Button Link",
      type: "url",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
