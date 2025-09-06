import { defineType, defineField } from "sanity";

export default defineType({
  name: "RoadmapSection",
  title: "Roadmap Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Work Package Roadmap",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      initialValue:
        "Our work is structured into focused work packages — each led by expert partners across Europe. From citizen engagement to digital tools, these packages outline the path to delivering community-led energy transformation.",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
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
            defineField({ name: "number", title: "Number", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "content", title: "Content", type: "text" }),
            defineField({ name: "partner", title: "Partner", type: "string" }),
            defineField({ name: "containerClass", title: "Container CSS Classes", type: "string" }),
            defineField({ name: "titleClass", title: "Title CSS Classes", type: "string" }),
            defineField({ name: "numberClass", title: "Number CSS Classes", type: "string" }),
            defineField({ name: "partnerClass", title: "Partner CSS Classes", type: "string" }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).warning("You can add up to 3 cards only"),
    }),
  ],
});
