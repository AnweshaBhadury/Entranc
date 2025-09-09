import home from "./home";
import Hero from "./HomePageSchema/Hero";
import TransitionSection from "./HomePageSchema/TransitionSection";
import ConsortiumSection from "./HomePageSchema/ConsortiumSection";
import StatsSection from "./HomePageSchema/StatsSection";
import RoadmapSection from "./HomePageSchema/RoadmapSection";
import ResourceSection from "./HomePageSchema/ResourceSection";
import MakingEnergySection from "./HomePageSchema/MakingEnergySection";
import Marquee from "./HomePageSchema/Marquee";

import about from "./about";
import AboutHero from "./AboutPageSchema/AboutHero";
import HowBehindUs from "./AboutPageSchema/HowBehindUs";
import OurTeam from "./AboutPageSchema/OurTeam";
import WhoWeAre from "./AboutPageSchema/WhoWeAre";
import WhyBehindUs from "./AboutPageSchema/WhyBehindUs";

import pilot from "./pilot";
import ImpactSection from "./PilotPageSchema/ImpactSection";
import JoinJourney from "./PilotPageSchema/JoinJourney";
import PilotHero from "./PilotPageSchema/PilotHero";
import ProjectsSection from "./PilotPageSchema/ProjectsSection";



import contact from "./contact";
import ContactHero from "./ContactPageSchema/ContactHero";
import ContactFormSection from "./ContactPageSchema/ContactFormSection";
import FaqSection from "./ContactPageSchema/FaqSection";


import blockContent, { imageWithAlt, codeBlock, oembed,videoBlock, callout, pullquote,gallery,cta } from "./BlogPageSchema/blockContent";
import blog from "./blog";
import author from "./BlogPageSchema/author";


import Footer from "./Footer";
import contactSubmit from "./contactSubmit";
import localeString from "./objects/localeString";
import localeText from "./objects/localeText";



export const schemaTypes = [
  // home page
  home,
  Hero,
  TransitionSection,
  ConsortiumSection,
  StatsSection,
  RoadmapSection,
  ResourceSection,
  MakingEnergySection,
  Marquee,

  // about page
  about,
  AboutHero,
  HowBehindUs,
  OurTeam,
  WhoWeAre,
  WhyBehindUs,

  // pilot page
  pilot,
  ImpactSection,
  JoinJourney,
  PilotHero,
  ProjectsSection,

  //Contact Page
  contact,
  ContactHero,
  ContactFormSection,
  FaqSection,

  //blog page
  imageWithAlt, codeBlock, oembed,videoBlock, callout, pullquote,gallery,cta,author,
  blockContent,
  blog,

  //contact submit
  contactSubmit,

  localeString,
  localeText,

  //footer
  Footer
];
