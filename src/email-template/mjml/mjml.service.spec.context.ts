export interface SampleTemplateContext {
  title: string;
  name: string;
  url: string;
  references: Array<{
    name: string;
    author: string;
  }>;
}

export const example1 = {
  title: 'The Prophetic Practice of Mindful Walking',
  name: 'Hamza Yusuf',
  url: 'https://www.youtube.com/watch?v=QpK36YseSqI',
  references: [
    {
      name: 'The Book of Prayer',
      author: 'Abu Dawud',
    },
  ],
};
