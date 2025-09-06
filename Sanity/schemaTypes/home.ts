import { defineType, defineField } from "sanity"

export default defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "HeroSection",
      title: "Hero Section",
      type: "Hero", 
    }),
    defineField({
      name: "TransitionSection",
      title: "Transition Section",
      type: "TransitionSection",
    }),
    defineField({
      name: "ConsortiumSection",
      title: "Consortium Section",
      type: "ConsortiumSection",
    }),
    defineField({
      name: "StatsSection",
      title: "Stats Section",
      type: "StatsSection",
    }),
    defineField({
      name: "RoadmapSection",
      title: "Roadmap Section",
      type: "RoadmapSection",
    }),
    defineField({
      name: "ResourceSection",
      title: "Resource Section",
      type: "ResourceSection",
    }),
    defineField({
      name: "MakingEnergySection",
      title: "Making Energy Section",
      type: "MakingEnergySection",
    }),
    defineField({
      name: "Marquee",
      title: "Marquee Section",
      type: "Marquee",   // ✅ Corrected here
    }),
  ],
})
