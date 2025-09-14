// ./schemas/PilotPageSchema/PilotHero.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "PilotHero",
  title: "Pilot Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString", // multilingual
      description: "Main heading displayed in the hero section",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Hero background image",
    }),
    defineField({
      name: "scrollIndicatorText",
      title: "Scroll Indicator Text",
      type: "localeString", // multilingual
      description: "Text displayed next to the down arrow",
    })
  ],
});
