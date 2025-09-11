// ./schemas/ProjectsSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "ProjectsSection",
  title: "Projects Section (website project cards)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Section heading (what visitors see above the cards)",
      type: "localeString",
      description:
        "Text shown at the top of the Projects section on the website. Example: 'Our Projects' or 'Ongoing Projects'.",
    }),
    defineField({
      name: "projects",
      title: "List of project cards",
      type: "array",
      of: [
        {
          type: "object",
          name: "project",
          title: "Single project card",
          fields: [
            defineField({
              name: "status",
              title: "Project stage (short label visitors see)",
              type: "localeString",
              description:
                "Short label describing project progress. Example: 'IN PLANNING', 'PRE-APPROVAL', 'UNDER REVIEW'.",
            }),
            defineField({
              name: "title",
              title: "Project name (headline)",
              type: "localeString",
              description: "Name of the project shown prominently on the card. Example: 'Windpark Eichenau'.",
            }),
            defineField({
              name: "description",
              title: "Short description (what this project does)",
              type: "localeText",
              description:
                "A short paragraph explaining the project in simple language. Keep it 1–2 sentences so visitors can quickly understand it.",
            }),
            defineField({
              name: "partners",
              title: "Partners (who is involved)",
              type: "localeString",
              description:
                "Names of organisations or groups involved in the project. Use commas or semicolons to separate multiple names. Example: 'Sonnensegler eG; Municipality of Eichenau'.",
            }),

            // Icon selection (keeps both preset choice and image upload)
            defineField({
              name: "iconType",
              title: "Choose a preset icon (optional)",
              type: "string",
              description:
                "Pick a simple icon to represent the project (wind turbine, battery, etc.). If you prefer to upload your own image, use the 'Upload custom image' field below.",
              options: {
                list: [
                  { title: "Wind (stylised turbine)", value: "FaWind" },
                  { title: "Battery / Power (stylised battery)", value: "PowerBattery" },
                  { title: "No preset icon", value: "none" },
                ],
                layout: "dropdown",
              },
            }),
            defineField({
              name: "icon",
              title: "Upload custom image (optional)",
              type: "image",
              options: { hotspot: true },
              description:
                "Upload a small image or icon to use on the card. This replaces the preset icon if both are set. Common formats: PNG/JPG/SVG.",
            }),

            // Design choices with descriptive titles for non-technical users
            defineField({
              name: "customContainerClass",
              title: "Card appearance — choose background & text style",
              type: "string",
              description:
                "Choose how the card looks. Each option is a ready-made visual style; no coding needed. Example shown below for each choice.",
              options: {
                list: [
                  {
                    title: "White card — white background, dark text (clean, neutral)",
                    value: "bg-white text-primary",
                  },
                  {
                    title:
                      "Primary colored card with decorative grid — dark/brand background, light text (bold, branded)",
                    value: "bg-m-primary text-white bg-grid-pattern bg-grid-size",
                  },
                  {
                    title:
                      "Primary solid with decorative overflow — solid background with subtle large image in the back (stylish)",
                    value: "bg-m-primary text-white relative overflow-hidden",
                  },
                ],
                layout: "dropdown",
              },
              initialValue: "bg-white text-primary",
            }),

            defineField({
              name: "partnerBgClass",
              title: "Partners area background (small label under title)",
              type: "string",
              description:
                "Choose a subtle background for the partners label or strip so partner names stand out. These are preset options — no CSS knowledge required.",
              options: {
                list: [
                  { title: "Soft yellow (light) — good on white cards", value: "bg-yellow-50" },
                  { title: "Translucent white — good on dark/primary cards", value: "bg-white/10" },
                  { title: "Slight translucent white (more visible)", value: "bg-white/20" },
                  { title: "None / use card background", value: "" },
                ],
                layout: "dropdown",
              },
              initialValue: "bg-yellow-50",
            }),

            defineField({
              name: "buttonPrimaryClass",
              title: "Primary button style (main call-to-action)",
              type: "string",
              description:
                "Choose the main button appearance that users click first (for example 'Read more' or 'Get involved'). These are ready-made styles — choose the look you prefer.",
              options: {
                list: [
                  {
                    title: "Brand colored button — solid brand color with white text (standout)",
                    value: "bg-m-primary text-white hover:bg-primary",
                  },
                  {
                    title: "White button on dark card — white button with dark text (subtle)",
                    value: "bg-white text-primary hover:bg-gray-200",
                  },
                ],
                layout: "dropdown",
              },
              initialValue: "bg-m-primary text-white hover:bg-primary",
            }),

            defineField({
              name: "buttonSecondaryClass",
              title: "Secondary button style (less prominent action)",
              type: "string",
              description:
                "Style for the secondary button (example: 'View map' or 'Get involved'). Typically less dominant than the primary button.",
              options: {
                list: [
                  {
                    title: "Outlined primary — border and primary text (classic)",
                    value: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
                  },
                  {
                    title:
                      "White outline on dark card — white border and white text (contrasts on dark backgrounds)",
                    value: "border-2 border-white text-white hover:bg-white hover:text-primary",
                  },
                ],
                layout: "dropdown",
              },
              initialValue:
                "border-2 border-primary text-primary hover:bg-primary hover:text-white",
            }),

            // Optional advanced / extra fields
            defineField({
              name: "iconClassName",
              title: "Decorative icon positioning (advanced, optional)",
              type: "string",
              description:
                "Only use this if you want extra control over a large decorative image on the card (example provided). Leave blank for normal placement.",
            }),
            defineField({
              name: "readMoreUrl",
              title: "Link for 'Read more' (optional)",
              type: "url",
              description: "Enter a web address where visitors can read detailed information about this project.",
            }),
            defineField({
              name: "getInvolvedUrl",
              title: "Link for 'Get involved' (optional)",
              type: "url",
              description: "Enter a web address where visitors can sign up, volunteer, or contact project organisers.",
            }),
            defineField({
              name: "mapUrl",
              title: "Map link (optional)",
              type: "url",
              description: "A link to a map or map view that shows where the project is located (example: Google Maps link).",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).warning("Add at least one project"),
    }),
  ],
});
