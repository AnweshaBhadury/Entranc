// schemas/post.js
import { defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required().min(10).max(120),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'localeText',
      description:
        'Short summary for listings and meta description (approx 120-160 chars)',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'authors',
      title: 'Author(s)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      validation: (Rule) => Rule.min(1),
    },
    {
      name: 'primaryAuthor',
      title: 'Primary Author (for preview)',
      type: 'reference',
      to: [{ type: 'author' }],
    },

    // --- Category as select (fixed list) ---
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'All', value: 'All' },
          { title: 'Pilot Projects', value: 'Pilot Projects' },
          { title: 'Community', value: 'Community' },
          { title: 'Policy', value: 'Policy' },
        ],
        layout: 'dropdown', // use 'radio' for radio buttons
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'The date when this post should be treated as published',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Human readable date',
      type: 'string',
      description:
        'Optional formatted date (eg "06th Aug, 2025"). Use if you want a separate display date.',
    },
    {
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'localeString', validation: (Rule) => Rule.required() },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
    },
    {
      name: 'isHighlight',
      title: 'Is Highlight',
      type: 'boolean',
      description: 'Show this post in highlight carousels or hero sections',
    },
    {
      name: 'readingTime',
      title: 'Estimated reading time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent', // ensure blockContent is defined/imported in your schemas index
    },
    {
      name: 'relatedPosts',
      title: 'Related posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta title', type: 'string' },
        {
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          validation: (Rule) => Rule.max(320),
        },
        { name: 'shareImage', title: 'Share image', type: 'image', options: { hotspot: true } },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
      ],
    },
    {
      name: 'externalId',
      title: 'External ID',
      type: 'string',
      description: 'If you are importing posts from another system, store the external id here.',
    },
  ],

  orderings: [
    { title: 'Newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Oldest', name: 'publishedAtAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'featuredImage',
      author0: 'primaryAuthor.name',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const { title, subtitle, media, author0, publishedAt } = selection;
      return {
        title,
        subtitle: author0 ? `${author0} — ${new Date(publishedAt).toLocaleDateString()}` : subtitle,
        media,
      };
    },
  },
});
