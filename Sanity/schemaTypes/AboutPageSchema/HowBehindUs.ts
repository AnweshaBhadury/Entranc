// ./schemas/AboutPageSchema/howBehindUs.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "HowBehindUs",
  title: "How Behind Us Section",
  type: "object",
  fields: [
    defineField({
      name: "introLabel",
      title: "Intro Label",
      type: "localeString",
      description: "Text above the heading, e.g., '💡 Our Values & Team'",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      description: "Main heading of the section, e.g., 'The How Behind Us'",
    }),
    defineField({
      name: "tiles",
      title: "Tiles",
      type: "array",
      of: [
        {
          name: "tile",
          title: "Tile",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Tile Title",
              type: "localeString",
            }),
            defineField({
              name: "description",
              title: "Tile Description",
              type: "localeText",
            }),
            defineField({
              name: "special",
              title: "Special Tile?",
              type: "boolean",
              description: "Mark if this is the highlighted tile with background image",
              initialValue: false,
            }),
            defineField({
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              description: "Optional: only used if tile is special",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5).warning("Recommended: maximum 5 tiles"),
    }),
  ],
});
