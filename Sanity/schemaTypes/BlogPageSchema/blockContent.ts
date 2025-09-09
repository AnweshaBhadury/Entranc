// schemas/blockContent.ts
import { defineType, defineArrayMember } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image (with alt & caption)',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Important for accessibility and SEO. Describe the image briefly.',
      validation: (Rule: any) => Rule.required().max(200),
    },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'attribution', title: 'Attribution / Credit', type: 'string' },
    { name: 'fullWidth', title: 'Full width', type: 'boolean' },
  ],
  preview: {
    select: { title: 'alt', media: 'asset' },
    prepare(selection: any) {
      const { title } = selection;
      return { title: title || 'Image' };
    },
  },
});

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          'javascript','typescript','python','java','csharp','cpp','bash','json','html','css','sql','yaml','other'
        ].map((v) => ({ title: v, value: v })),
      },
    },
    { name: 'filename', title: 'Filename', type: 'string' },
    { name: 'code', title: 'Code', type: 'text' },
    { name: 'showLineNumbers', title: 'Show line numbers', type: 'boolean', initialValue: true },
  ],
  preview: {
    select: { language: 'language', filename: 'filename' },
    prepare({ language, filename }: any) {
      return {
        title: filename ? `${filename}` : 'Code block',
        subtitle: language ? language : 'unknown language',
      };
    },
  },
});

export const oembed = defineType({
  name: 'oembed',
  title: 'Embed (oEmbed)',
  type: 'object',
  fields: [
    { name: 'url', title: 'URL', type: 'url', validation: (Rule: any) => Rule.uri({ allowRelative: false }) },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
  preview: { select: { title: 'title', subtitle: 'url' } },
});

export const videoBlock = defineType({
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  fields: [
    { name: 'videoFile', title: 'Video file (optional)', type: 'file', options: { accept: 'video/*' } },
    { name: 'externalUrl', title: 'External video URL (YouTube/Vimeo)', type: 'url', validation: (Rule: any) => Rule.uri({ allowRelative: false }) },
    { name: 'caption', title: 'Caption', type: 'string' },
    { name: 'poster', title: 'Poster image', type: 'image', options: { hotspot: true } },
  ],
  preview: { select: { title: 'caption', subtitle: 'externalUrl' } },
});

export const callout = defineType({
  name: 'callout',
  title: 'Callout / Notice',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: [
        { title: 'Info', value: 'info' },
        { title: 'Warning', value: 'warning' },
        { title: 'Success', value: 'success' },
        { title: 'Danger', value: 'danger' },
      ] },
      initialValue: 'info',
    },
    { name: 'icon', title: 'Icon (optional)', type: 'string', description: 'Icon name or emoji' },
    { name: 'text', title: 'Text', type: 'text' },
  ],
  preview: {
    select: { text: 'text', style: 'style' },
    prepare({ text, style }: any) {
      return { title: `${style} callout`, subtitle: text && text.slice(0, 60) + (text && text.length > 60 ? '…' : '') };
    },
  },
});

export const pullquote = defineType({
  name: 'pullquote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text', validation: (Rule: any) => Rule.required() },
    { name: 'attribution', title: 'Attribution', type: 'string' },
    { name: 'align', title: 'Alignment', type: 'string', options: { list: [
      { title: 'Center', value: 'center' },
      { title: 'Left', value: 'left' },
      { title: 'Right', value: 'right' },
    ] }, initialValue: 'center' },
  ],
  preview: {
    select: { quote: 'quote', attribution: 'attribution' },
    prepare({ quote, attribution }: any) {
      return { title: quote && quote.slice(0, 70) + (quote.length > 70 ? '…' : ''), subtitle: attribution || '' };
    },
  },
});

export const gallery = defineType({
  name: 'gallery',
  title: 'Image gallery',
  type: 'object',
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [{ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule: any) => Rule.required() }]
      }],
      validation: (Rule: any) => Rule.min(1),
    },
    { name: 'columns', title: 'Columns', type: 'number', initialValue: 3 },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
  preview: { select: { title: 'caption', media: 'images.0' } },
});

export const cta = defineType({
  name: 'cta',
  title: 'Inline CTA',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'url', title: 'URL', type: 'url', validation: (Rule: any) => Rule.uri({ allowRelative: true }) },
    { name: 'style', title: 'Style', type: 'string', options: { list: [
      { title: 'Primary', value: 'primary' },
      { title: 'Secondary', value: 'secondary' },
      { title: 'Ghost', value: 'ghost' },
    ] }, initialValue: 'primary' },
  ],
  preview: { select: { label: 'label', subtitle: 'url' } },
});

export default defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      title: 'Block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 1', value: 'h1' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }, { title: 'Numbered', value: 'number' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike-through', value: 'strike-through' },
          { title: 'Inline code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              { name: 'href', title: 'URL', type: 'url', validation: (Rule: any) => Rule.uri({ allowRelative: false }) },
              { name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: true },
              { name: 'nofollow', title: 'Nofollow', type: 'boolean', initialValue: false },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal reference',
            fields: [
              { name: 'reference', title: 'Reference', type: 'reference', to: [{ type: 'post' }, { type: 'author' }] },
              { name: 'label', title: 'Label (optional)', type: 'string' },
            ],
          },
          {
            name: 'email',
            type: 'object',
            title: 'Email link',
            fields: [{ name: 'email', title: 'Email', type: 'string', validation: (Rule: any) => Rule.email() }],
          },
          {
            name: 'mention',
            type: 'object',
            title: 'Mention (Author)',
            fields: [{ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] }],
          },
        ],
      },
    }),

    // block-level custom object members
    { type: 'imageWithAlt' },
    { type: 'codeBlock' },
    { type: 'oembed' },
    { type: 'videoBlock' },
    { type: 'callout' },
    { type: 'pullquote' },
    { type: 'gallery' },
    { type: 'cta' },
  ],
});
