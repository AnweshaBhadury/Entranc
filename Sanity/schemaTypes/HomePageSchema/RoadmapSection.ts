import { defineType, defineField } from "sanity";

export default defineType({
  name: "RoadmapSection",
  title: "Roadmap Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "title",
      type: "localeString",
      initialValue: "Work Package Roadmap",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      initialValue:
        "Our work is structured into focused work packages — each led by expert partners across Europe. From citizen engagement to digital tools, these packages outline the path to delivering community-led energy transformation.",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "localeString",
      initialValue: "Read Blogs",
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "url",
    }),
    defineField({
      name: "cards",
      title: "Roadmap Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "roadmapCard",
          fields: [
            defineField({ name: "number", title: "Number", type: "string"}),
            defineField({ name: "title", title: "Title", type: "localeString"}),
            defineField({ name: "content", title: "Content", type: "localeText" }),
            defineField({ name: "partner", title: "Partner", type: "localeString"}),
            defineField({
              name: "containerClass",
              title: "Container Style",
              type: "string",
              initialValue: "bg-s2 text-primary",
              options: {
                list: [
                  { title: "Light Section (Soft Gray background, Dark Text)", value: "bg-s2 text-primary" },
                  { title: "White Section (White background with Soft Gray Border)", value: "bg-white border-2 border-s2" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "titleClass",
              title: "Title Style",
              type: "string",
              initialValue: "text-primary",
              options: {
                list: [
                  { title: "Primary Title (Green Text)", value: "text-primary" },
                  { title: "Secondary Title (Soft Gray Text)", value: "text-s2" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "numberClass",
              title: "Number Style",
              type: "string",
              initialValue: "text-primary/20",
              options: {
                list: [
                  { title: "Primary Number (Light Green, 20% opacity)", value: "text-primary/20" },
                  { title: "Secondary Number (Light Gray, 20% opacity)", value: "text-s2/20" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "partnerClass",
              title: "Partner Name Style",
              type: "string",
              initialValue: "text-primary",
              options: {
                list: [
                  { title: "Primary Partner (Green Text)", value: "text-primary" },
                  { title: "Secondary Partner (Gray Text)", value: "text-s2" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),

          ],
        },
      ],
      validation: (Rule) => Rule.max(3).warning("You can add up to 3 cards only"),
    }),
  ],
});
