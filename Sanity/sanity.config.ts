import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "EntranC",

  projectId: "kn8ctvrb",   // your client’s project
  dataset: "production",   // dataset

  plugins: [
    structureTool(),
    visionTool(),
    internationalizedArray({
      languages: [
        { id: "en", title: "English" },
        { id: "de", title: "Deutsch" },
      ],
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text"], 
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
