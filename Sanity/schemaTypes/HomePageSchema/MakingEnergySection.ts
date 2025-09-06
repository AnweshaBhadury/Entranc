import { defineType, defineField } from "sanity";

export default defineType({
  name: "MakingEnergySection",
  title: "Making Energy Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Main heading of the section",
      // i18n will automatically work if you enabled the plugin globally
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Intro Text",
      type: "string",
      description: "Small text above the heading",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Section description text",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      initialValue: "Read Blogs",
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Card Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "texts",
              title: "Card Texts",
              type: "array",
              of: [{ type: "string" }],
              description: "Add one or more texts (used for marquee if multiple)",
            }),
            defineField({
              name: "hasMarquee",
              title: "Enable Marquee",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).warning("You can add up to 3 cards only")

    }),
  ],
});
