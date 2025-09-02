import { defineType, defineField } from "sanity"

export default defineType({
  name: "CalculatorSection",
  title: "Calculator Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Main title of the calculator section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Text describing the calculator section",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Background or illustrative image",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "url",
      description: "Optional URL when clicking the button",
    }),
  ],
})
