// ./schemas/AboutPageSchema/ourTeam.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "OurTeam",
  title: "Our Team Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Our Team",
      description: "Main heading of the section",
    }),
    defineField({
      name: "members", // <- corrected to match GROQ query
      title: "Team Members",
      type: "array",
      of: [
        {
          name: "member",
          title: "Team Member",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "image",
              title: "Profile Image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).warning("Add at least one team member"),
    }),
  ],
});
