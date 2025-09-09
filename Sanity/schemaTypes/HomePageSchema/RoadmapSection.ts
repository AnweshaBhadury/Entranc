import { defineType, defineField } from "sanity";

export default defineType({
  name: "RoadmapSection",
  title: "Roadmap Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
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
            defineField({ name: "number", title: "Number", type: "localeString", initialValue: "1" }),
            defineField({ name: "title", title: "Title", type: "localeString", initialValue: "Card Title" }),
            defineField({ name: "content", title: "Content", type: "localeText", initialValue: "Card content goes here." }),
            defineField({ name: "partner", title: "Partner", type: "localeString", initialValue: "Partner Name" }),
            defineField({ name: "containerClass", title: "Container CSS Classes", type: "localeString", initialValue: "bg-s2 text-primary" }),
            defineField({ name: "titleClass", title: "Title CSS Classes", type: "localeString", initialValue: "text-primary" }),
            defineField({ name: "numberClass", title: "Number CSS Classes", type: "localeString", initialValue: "text-primary/20" }),
            defineField({ name: "partnerClass", title: "Partner CSS Classes", type: "localeString", initialValue: "text-primary" }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).warning("You can add up to 3 cards only"),
    }),
  ],
});
