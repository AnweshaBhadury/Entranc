import { defineType, defineField } from "sanity";

export default defineType({
  name: "ConsortiumSection",
  title: "Consortium Section",
  type: "object", // lives inside Home Page
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Consortium",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      initialValue:
        "Powered by a diverse consortium of innovators, cooperatives, and institutions — working together for a shared energy future.",
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
