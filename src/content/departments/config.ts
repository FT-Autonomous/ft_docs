import { defineCollection, z } from 'astro:content';
const departmentCollection = defineCollection({
    type: 'content',
    schema: () => z.object({ title: z.string() }),
});
export const collections = { department: departmentCollection };
