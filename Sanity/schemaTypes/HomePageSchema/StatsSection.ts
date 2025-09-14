import { defineType, defineField } from "sanity";

export default defineType({
  name: "StatsSection",
  title: "Stats Section",
  type: "object",
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
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "The image behind the stats section",
    }),

    // === Blog-style cards ===
    defineField({
      name: "cards",
      title: "Blog / Stats Cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "blogCard",
          title: "Blog Card",
          fields: [
            defineField({ name: "title", title: "Title", type: "localeString" }),
            defineField({ name: "tag", title: "Tag", type: "localeString" }),
            defineField({
              name: "tagColor",
              title: "Tag Color",
              type: "string",
              options: {
                list: [
                  { title: "Sky Blue background with Sky text", value: "bg-s1/20 text-s1" },
                  { title: "Light Green background with Dark Green text", value: "bg-green-200 text-green-800" },
                  { title: "Light Orange background with Dark Orange text", value: "bg-orange-200 text-orange-800" },
                  { title: "Light Blue background with Dark Blue text", value: "bg-blue-200 text-blue-800" },
                  { title: "Light Purple background with Dark Purple text", value: "bg-purple-200 text-purple-800" },
                  { title: "Light Red background with Dark Red text", value: "bg-red-200 text-red-800" },
                  { title: "Light Yellow background with Dark Yellow text", value: "bg-yellow-200 text-yellow-800" },
                  { title: "Light Teal background with Dark Teal text", value: "bg-teal-200 text-teal-800" },
                  { title: "Pale Green background with Medium Green text", value: "bg-s2/20 text-m-s2" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({
              name: "iconImage",
              title: "Icon (Image)",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "iconUrl",
              title: "Icon URL (fallback)",
              type: "url",
            }),
            defineField({
              name: "image",
              title: "Card Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "imageAlt", title: "Image alt text", type: "localeString" }),
            defineField({ name: "imageCaption", title: "Image caption", type: "localeString" }),

            defineField({
              name: "statValue",
              title: "card text",
              type: "localeString",
            }),
            defineField({ name: "ctaText", title: "CTA Text", type: "localeString" }),
            defineField({ name: "ctaLink", title: "CTA Link", type: "url" }),
          ],

          preview: {
            select: { title: "title", tag: "tag", image: "image", position: "imagePosition" },
            prepare({ title, tag, image, position }) {
              return {
                title: title || tag || "Untitled card",
                subtitle: position ? `Layout: ${position}` : "Layout: —",
                media: image,
              };
            },
          },
        },
      ],
    }),
  ],
});
