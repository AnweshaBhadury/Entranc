// ./schemas/marquee.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "Marquee",
  title: "Marquee Section",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Marquee Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "localeText",
              title: "localeText",
              type: "localeString",
              description: "Marquee text (e.g., Power to the People.)",
            }),
            defineField({
              name: "iconType",
              title: "Icon Type",
              type: "string",   // ✅ should be "string", not localeString
              options: {
                list: [
                  { title: "User Group (HiOutlineUserGroup)", value: "userGroup" },
                  { title: "Bulb Image", value: "bulb" },
                ],
                layout: "dropdown", // 👈 dropdown instead of radio
              },
              description:
                "Choose whether this item should be a user-group icon or a bulb image",
            }),
          ],
        },
      ],
    }),
  ],
});
