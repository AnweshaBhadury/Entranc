import { defineType, defineField } from "sanity";

export default defineType({
  name: "ResourceSection",
  title: "Resource Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Community & Resources",
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "resourceCard",
          fields: [
            defineField({ name: "type", title: "Type", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
            defineField({ name: "btnText", title: "Button Text", type: "string" }),
            defineField({ name: "containerClass", title: "Container CSS Classes", type: "string" }),
            defineField({ name: "buttonClass", title: "Button CSS Classes", type: "string" }),
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
  ],
});
