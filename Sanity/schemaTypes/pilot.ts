// ./schemas/PilotPageSchema/pilot.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "pilot",
  title: "Pilot Page",
  type: "document",
  fields: [
    defineField({
      name: "PilotHero",
      title: "Pilot Hero Section",
      type: "PilotHero", 
    }),
    defineField({
      name: "ProjectsSection",
      title: "Projects Section",
      type: "ProjectsSection", 
    }),
    defineField({
      name: "ImpactSection",
      title: "Impact Section",
      type: "ImpactSection", 
    }),
    defineField({
      name: "JoinJourney",
      title: "Join Our Journey Section",
      type: "JoinJourney",
    }),
  ],
});
