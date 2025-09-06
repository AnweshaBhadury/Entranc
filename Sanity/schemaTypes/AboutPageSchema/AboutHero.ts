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
      type: "string",
      description: "Main heading displayed in the hero section",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
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
      type: "string",
      initialValue: "Scroll",
      description: "Text displayed next to the down arrow",
    }),
    defineField({
      name: "scrollIconType",
      title: "Scroll Icon",
      type: "string",
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
