import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.string().default('기타'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Posts with pubDate before 2020 are automatically archived
  }),
});

export const collections = { blog };
