// ./schemas/PilotPageSchema/JoinJourney.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "JoinJourney",
  title: "Join Our Journey Section",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString", // multilingual automatically
      description: "Main heading of the section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText", // multilingual
      description: "Paragraph describing the section",
    }),
    defineField({
      name: "investmentInfo",
      title: "Investment Info",
      type: "localeString", // multilingual
      description: "Short info about the investment",
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Email Input Placeholder",
      type: "localeString", // multilingual
    }),
    defineField({
      name: "buttonText",
      title: "Submit Button Text",
      type: "localeString", // multilingual
    }),
    defineField({
      name: "backgroundPattern",
      title: "Background Pattern Image",
      type: "image",
      options: { hotspot: true },
      description: "Light background pattern behind the section",
    }),
    defineField({
      name: "icon",
      title: "Decorative Icon",
      type: "image",
      options: { hotspot: true },
      description: "Optional icon, e.g., email envelope on the right",
    }),
  ],
});
