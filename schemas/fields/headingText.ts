import {defineField} from 'sanity'
import {brandColorInput} from './brandColor'

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
              defineField({
                name: 'color',
                title: 'Color',
                initialValue: 'orange',
                ...brandColorInput,
                validation: (Rule) => Rule.required(),
              }),
            ],
          },
        ],
      },
    },
  ],
}
