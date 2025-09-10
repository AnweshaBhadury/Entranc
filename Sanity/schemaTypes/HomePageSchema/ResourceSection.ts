import { defineType, defineField } from "sanity";

export default defineType({
  name: "ResourceSection",
  title: "Resource Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
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
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Content", value: "content" },
                  { title: "Image", value: "image" },
                ],
                layout: "dropdown", // 👈 ensures it's a dropdown
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "localeString" }),
            defineField({ name: "description", title: "Description", type: "localeText" }),
            defineField({ name: "btnText", title: "Button Text", type: "localeString" }),

            defineField({
              name: "containerClass",
              title: "Container Style",
              type: "string",
              options: {
                list: [
                  { title: "Light Section (Gray background, Dark Text)", value: "bg-s2 text-primary" },
                  { title: "Dark Teal Section (Teal background, White Text)", value: "bg-m-s2 text-white" },
                  { title: "Toolbox Theme (Blue background, White Text)", value: "bg-t-primary text-white" },
                  { title: "Primary Section (Green background, White Text)", value: "bg-primary text-white" },
                  { title: "Highlight Section (Blue background, White Text)", value: "bg-s1 text-white" },
                ],
                layout: "dropdown",
              },
             
            }),

            defineField({
              name: "buttonClass",
              title: "Button Style",
              type: "string",
              options: {
                list: [
                  { title: "Light Button (Off-white background, Dark Text)", value: "bg-bg-offwhite text-primary hover:bg-white" },
                  { title: "Gold Button (Yellow background, White Text)", value: "bg-yellow-800 text-white hover:bg-yellow-900" },
                  { title: "Blue Toolbox Button (Blue background, White Text)", value: "bg-t1-primary text-white hover:bg-m-primary" },
                  { title: "Green Button (Dark Green background, White Text)", value: "bg-m-primary text-white hover:bg-green-800" },
                  { title: "Blue Button (Bright Blue background, White Text)", value: "bg-blue-500 text-white hover:bg-blue-600" },
                ],
                layout: "dropdown",
              },
             
            }),



            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
          ],
        },
      ],
    }),
  ],
});
