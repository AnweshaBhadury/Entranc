// schemas/contact.js
export default {
  name: 'contactSubmit',
  title: 'Contact Submission',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' , readOnly: true },
    { name: 'email', title: 'Email', type: 'string' , readOnly: true },
    { name: 'message', title: 'Message', type: 'text' , readOnly: true },
    {
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      options: { sortable: true },
      readOnly: true 
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      createdAt: 'createdAt'
    },
    prepare(selection: any) {
      const { title, subtitle, createdAt } = selection
      return {
        subtitle,
        title: `${title ?? ''} • ${createdAt ? new Date(createdAt).toLocaleString() : ''}`
      }
    }
  }
};
