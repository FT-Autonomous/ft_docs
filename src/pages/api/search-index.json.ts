import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async () => {
  const collections = ['departments', 'tutorials', 'equipment', 'resources', 'guidelines'];
  const data = [];

  for (const collection of collections) {
    const entries = await getCollection(collection);

    for (const entry of entries) {
      const title = entry.data.title ?? '';
      const content = entry.body ?? '';
      const slug = `/${collection}/${entry.slug}`;

      data.push({ title, content, slug });
    }
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
