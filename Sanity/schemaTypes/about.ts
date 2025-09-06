import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "AboutHero",
      title: "About Hero Section",
      type: "AboutHero", 
    }),
    defineField({
      name: "WhoWeAre",
      title: "Who We Are Section",
      type: "WhoWeAre",
    }),
    defineField({
      name: "HowBehindUs",
      title: "How Behind Us Section",
      type: "HowBehindUs",
    }),
    defineField({
      name: "OurTeam",
      title: "Our Team Section",
      type: "OurTeam",
    }),
    defineField({
      name: "WhyBehindUs",
      title: "Why Behind Us Section",
      type: "WhyBehindUs",
    }),
  ],
});
