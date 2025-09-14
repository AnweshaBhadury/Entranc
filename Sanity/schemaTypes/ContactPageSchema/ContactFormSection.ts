import { defineType, defineField } from "sanity";

export default defineType({
  name: "ContactFormSection",
  title: "Contact Form Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "localeString",
    }),
    defineField({
      name: "subText",
      title: "Sub Text",
      type: "localeText",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              description: "Select the platform (used in UI and code).",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Email", value: "email" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Map Embed URL",
      type: "url",
      description: "Copy the iframe src URL from Google Maps",
    }),
    defineField({
      name: "buttonText",
      title: "Submit Button Text",
      type: "localeString",
    }),
    // ✅ Submissions array
    /*defineField({
      name: "submissions",
      title: "Form Submissions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "email", title: "Email", type: "string" }),
            defineField({ name: "message", title: "Message", type: "localeText" }),
            defineField({
              name: "submittedAt",
              title: "Submitted At",
              type: "datetime",
              readOnly: true,
            }),
          ],
        },
      ],
    }),*/
  ],
});
