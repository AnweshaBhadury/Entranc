import { defineType, defineField } from "sanity";

export default defineType({
  name: "ImpactSection",
  title: "Impact Section",
  type: "object",
  fields: [
    defineField({
      name: "introLabel",
      title: "Intro Label",
      type: "localeString",
      description: "Text above the heading, e.g., 'Our Values & Team'",
      initialValue: "Our Values & Team",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      description: "Main heading of the section",
      initialValue: "The How Behind Us",
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
              type: "localeString",
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
              type: "localeString",
              hidden: ({ parent }) => parent?.type !== "title",
            }),
            defineField({
              name: "titleLine2",
              title: "Title Line 2",
              type: "localeString",
              hidden: ({ parent }) => parent?.type !== "title",
            }),
            defineField({
              name: "value",
              title: "Stat Value",
              type: "localeString",
              hidden: ({ parent }) => parent?.type !== "stat",
            }),
            defineField({
              name: "label",
              title: "Stat Label",
              type: "localeString",
              hidden: ({ parent }) => parent?.type !== "stat",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(5).warning("Add up to 5 impact items"),
    }),
  ],
});
