import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "EntranC",
  projectId: "kn8ctvrb",
  dataset: "production",

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: [
        { id: "en", title: "English" },
        { id: "de", title: "Deutsch" },
      ],
      defaultLanguages: ["en"], // ✅ keep plural
      fieldTypes: ["string", "text"], // auto converts these fields to multilingual arrays
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
