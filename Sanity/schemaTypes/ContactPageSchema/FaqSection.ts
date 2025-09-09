// schemas/faqSection.ts
import { Rule } from 'sanity';

export default {
  name: 'FaqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'localeString',
      description: 'Main heading for the FAQ section',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'List of questions and answers',
      of: [
        {
          type: 'object',
          title: 'FAQ Item',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'localeString',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'faqs.length',
    },
    prepare(selection: { title?: string; subtitle?: number }) {
      const { title, subtitle } = selection;
      return {
        title: title,
        subtitle: `${subtitle ?? 0} FAQs`,
      };
    },
  },
};
