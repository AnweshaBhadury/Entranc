import { defineType, defineField } from "sanity";

export default defineType({
  name: "ContactFormSection",
  title: "Contact Form Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "subText",
      title: "Sub Text",
      type: "text",
      rows: 3,
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
              options: { list: ["Instagram", "Facebook", "Email"] },
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
      name: "formFields",
      title: "Form Fields",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "type",
              title: "Field Type",
              type: "string",
              options: { list: ["text", "email", "textarea"] },
            }),
            defineField({ name: "placeholder", title: "Placeholder", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "buttonText",
      title: "Submit Button Text",
      type: "string",
      initialValue: "Submit",
    }),
    // ✅ Submissions array
    defineField({
      name: "submissions",
      title: "Form Submissions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({ name: "email", title: "Email", type: "string" }),
            defineField({ name: "message", title: "Message", type: "text" }),
            defineField({
              name: "submittedAt",
              title: "Submitted At",
              type: "datetime",
              readOnly: true,
            }),
          ],
        },
      ],
    }),
  ],
});
