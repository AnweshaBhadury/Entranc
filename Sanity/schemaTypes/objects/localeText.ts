// ./schemas/objects/localeText.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text" }),
    defineField({ name: "du", title: "Deutsch", type: "text" }),
  ],
});
