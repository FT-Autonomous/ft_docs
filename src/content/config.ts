import { defineCollection } from 'astro:content';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const collections = {
  departments: defineCollection({ schema }),
  tutorials: defineCollection({ schema }),
  equipment: defineCollection({ schema }),
  resources: defineCollection({ schema }),
  guidelines: defineCollection({ schema }),
};
