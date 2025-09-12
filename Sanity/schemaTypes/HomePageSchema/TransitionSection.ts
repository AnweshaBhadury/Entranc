import { defineType, defineField } from "sanity";

export default defineType({
  name: "TransitionSection",
  title: "Transition Section",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label / Intro",
      type: "localeString",
      description: "Small text above heading, e.g., 'EnTranC'",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
      description: "Main heading of the transition section",
    }),
    defineField({
      name: "mainDescription",
      title: "Main Description",
      type: "localeText",
      description: "Paragraph under heading",
    }),
    defineField({
      name: "imageDescription",
      title: "Image Description",
      type: "localeText",
      description: "Paragraph under the image",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "localeString",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "url",
      description: "Optional URL for the CTA button",
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
      type: "localeString",
      description: "Optional small text below the image, e.g., 'COMMUNITY ENERGY · EU SUPPORTED'",
    }),
  ],
});
