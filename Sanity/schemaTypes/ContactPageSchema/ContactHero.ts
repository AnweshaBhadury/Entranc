// ./schemas/HeroSections/ContactHero.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "ContactHero",
  title: "Contact Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Get in Touch",
      description: "Main heading of the hero section",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      description: "Optional subheading under the main heading",
    }),
    defineField({
      name: "scrollIndicatorText",
      title: "Scroll Indicator Text",
      type: "string",
      initialValue: "Scroll",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Hero background image",
    }),
  ],
});
