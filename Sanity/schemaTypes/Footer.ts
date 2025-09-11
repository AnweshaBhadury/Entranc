export default {
  name: 'Footer',
  title: 'Footer',
  type: 'document',
  fields: [
    {
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'localeString',
    },
    {
      name: 'poweredBy',
      title: 'Powered By Logos',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'coFunded',
      title: 'Co-funded Logo',
      type: 'image',
    },
    {
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Contact Phone',
      type: 'string',
    },
    {
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'localeString' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'localeString' },
            { name: 'url', title: 'URL', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform', type: 'localeString' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    },
  ],
};
