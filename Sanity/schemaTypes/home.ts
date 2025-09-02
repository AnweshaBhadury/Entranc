import { defineType, defineField } from "sanity"

export default defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "HeroSection",
      title: "Hero Section",
      type: "Hero", // must match the schema type name
    }),
    defineField({
      name: "TransitionSection",
      title: "Transition Section",
      type: "TransitionSection",
    }),
    defineField({
      name: "CalculatorSection",
      title: "Calculator Section",
      type: "CalculatorSection",
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
  ],
})
