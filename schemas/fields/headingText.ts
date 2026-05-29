/** Portable text for headings — bold + 5-color highlight annotation */
export const headingTextField = {
  type: 'array' as const,
  of: [
    {
      type: 'block',
      styles: [],
      lists: [],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'highlight',
            type: 'object',
            title: 'Highlight color',
            fields: [
              {
                name: 'color',
                title: 'Color',
                type: 'string',
                options: {
                  list: [
                    {title: 'Red', value: 'red'},
                    {title: 'Orange', value: 'orange'},
                    {title: 'Yellow', value: 'yellow'},
                    {title: 'Green', value: 'green'},
                    {title: 'Purple', value: 'purple'},
                  ],
                  layout: 'radio',
                },
                initialValue: 'orange',
                validation: (Rule) => Rule.required(),
              },
            ],
          },
        ],
      },
    },
  ],
}
