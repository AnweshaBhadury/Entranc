// ./schemas/AboutPageSchema/AboutHero.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "AboutHero",
  title: "About Hero Section",
  type: "object", // can be embedded inside Home page document
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
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Image behind the hero section",
    }),
    defineField({
      name: "scrollIndicatorText",
      title: "Scroll Indicator Text",
      type: "localeString",
      initialValue: "Scroll",
      description: "localeText displayed next to the down arrow",
    }),
    defineField({
      name: "scrollIconType",
      title: "Scroll Icon",
      type: "localeString",
      options: {
        list: [
          { title: "Arrow Down", value: "arrowDown" },
        ],
        layout: "radio",
      },
      initialValue: "arrowDown",
    }),
  ],
});
