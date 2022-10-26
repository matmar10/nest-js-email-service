export type SampleTemplateContext = {
  quality: string;
  people: Array<{
    firstName: string;
    lastName: string;
  }>;
};

export const example1: SampleTemplateContext = {
  quality: 'poor',
  people: [
    {
      firstName: 'Matthew',
      lastName: 'Martin',
    },
    {
      firstName: 'Omar',
      lastName: 'Martin',
    },
  ],
};