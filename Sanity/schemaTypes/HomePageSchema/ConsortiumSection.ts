import { defineType, defineField } from "sanity";

export default defineType({
  name: "ConsortiumSection",
  title: "Consortium Section",
  type: "object", // lives inside Home Page
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "localeString",
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link",
      type: "url",
      description: "Optional URL for the button",
    }),
    defineField({
      name: "riveAnimation",
      title: "Rive Animation File",
      type: "file",
      options: { accept: ".riv" },
      description: "Upload a .riv file for the Consortium section animation",
    }),
  ],
});
