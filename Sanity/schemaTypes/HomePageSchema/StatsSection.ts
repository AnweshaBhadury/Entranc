import { defineType, defineField } from "sanity"

export default defineType({
  name: "StatsSection",
  title: "Stats Section",
  type: "object", // embed in Home page
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Statistics that Speaks For Itself",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      initialValue: "In just a few years, we’re building more than infrastructure — we’re building trust, community, and measurable climate action...",
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
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "The image behind the stats section",
    }),
    defineField({
      name: "cards",
      title: "Stats Cards",
      type: "array",
      of: [
        defineField({
      name: "statCard",
      title: "Stat Card",
      type: "object",
      fields: [
        defineField({ name: "tag", title: "Tag", type: "string" }),
        defineField({ name: "tagColor", title: "Tag Color (CSS classes)", type: "string" }),
        defineField({ name: "iconUrl", title: "Icon Image URL", type: "url" }),
        defineField({ name: "content", title: "Content", type: "text" }),
      ],
        }),
      ],
    }),
  ],
})
