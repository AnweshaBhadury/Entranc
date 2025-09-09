// schemas/author.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', validation: (Rule:any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (Rule:any) => Rule.required() },
    { name: 'bio', title: 'Bio', type: 'text' },
    { name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } },
    { name: 'social', title: 'Social links', type: 'object', fields: [{ name: 'twitter', title: 'Twitter', type: 'url' }, { name: 'linkedin', title: 'LinkedIn', type: 'url' }] },
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
});
