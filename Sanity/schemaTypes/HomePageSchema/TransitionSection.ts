import { defineType, defineField } from "sanity"

export default defineType({
  name: "TransitionSection",
  title: "Transition Section",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label / Intro",
      type: "string",
      description: "Small text above heading, e.g., 'EnTranC'",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Main heading of the transition section",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Main paragraph describing the section",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "extraText",
      title: "Extra Text / Footer",
      type: "string",
      description: "Optional small text below the image, e.g., 'COMMUNITY ENERGY · EU SUPPORTED'",
    }),
  ],
})
