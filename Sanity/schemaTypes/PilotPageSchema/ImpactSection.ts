// ./PilotPageSchema/ImpactSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "ImpactSection",
  title: "Impact Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string", // plugin makes it multilingual
      description: "Main heading for the impact section",
    }),
    defineField({
      name: "subHeading",
      title: "Subheading / Intro Text",
      type: "string", // multilingual automatically
      description: "Small text above the heading",
    }),
    defineField({
      name: "items",
      title: "Impact Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "impactItem",
          fields: [
            defineField({
              name: "type",
              title: "Item Type",
              type: "string",
              options: {
                list: [
                  { title: "Title", value: "title" },
                  { title: "Stat", value: "stat" },
                ],
                layout: "radio",
              },
              initialValue: "stat",
            }),
            defineField({
              name: "titleLine1",
              title: "Title Line 1",
              type: "string", // multilingual
              hidden: ({ parent }) => parent?.type !== "title",
            }),
            defineField({
              name: "titleLine2",
              title: "Title Line 2",
              type: "string", // multilingual
              hidden: ({ parent }) => parent?.type !== "title",
            }),
            defineField({
              name: "value",
              title: "Stat Value",
              type: "string", // numbers usually don't need localization
              hidden: ({ parent }) => parent?.type !== "stat",
            }),
            defineField({
              name: "label",
              title: "Stat Label",
              type: "string", // multilingual
              hidden: ({ parent }) => parent?.type !== "stat",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5).warning("Add up to 5 impact items"),
    }),
  ],
});
