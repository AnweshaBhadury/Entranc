// ./schemas/PilotPageSchema/JoinJourney.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "JoinJourney",
  title: "Join Our Journey Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string", // multilingual automatically
      initialValue: "Join Our Journey",
      description: "Main heading of the section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text", // multilingual
      description: "Paragraph describing the section",
    }),
    defineField({
      name: "investmentInfo",
      title: "Investment Info",
      type: "string", // multilingual
      initialValue: "Minimum investment: €250",
      description: "Short info about the investment",
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Email Input Placeholder",
      type: "string", // multilingual
      initialValue: "Enter Your Email",
    }),
    defineField({
      name: "buttonText",
      title: "Submit Button Text",
      type: "string", // multilingual
      initialValue: "Submit",
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
