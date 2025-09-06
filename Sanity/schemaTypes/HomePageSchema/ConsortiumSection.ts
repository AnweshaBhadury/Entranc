import { defineType, defineField } from "sanity";

export default defineType({
  name: "ConsortiumSection",
  title: "Consortium Section",
  type: "object", // object so it lives inside home page
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
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Illustration or logos of the consortium",
    }),
  ],
});
