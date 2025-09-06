export const impactSectionQuery = `
  *[_type == "pilot"][0]{
    ImpactSection {
      heading,
      subHeading,
      items[]{
        type,
        titleLine1,
        titleLine2,
        value,
        label
      }
    }
  }
`;
