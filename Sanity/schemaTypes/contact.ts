import { defineType, defineField } from "sanity";

export default defineType({
  name: "contact",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "ContactHero",
      title: "Contact Hero Section",
      type: "ContactHero",
    }),
    defineField({
      name: "ContactFormSection",
      title: "Contact Form Section",
      type: "ContactFormSection",
    }),
    defineField({
      name: "FaqSection",
      title: "Frequently Asked Question Section",
      type: "FaqSection",
    }),
  ],
});
