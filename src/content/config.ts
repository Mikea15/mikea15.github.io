import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		published: z.boolean().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		categories: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional()
	}),
});

const projects = defineCollection({
	type:  'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		releaseDate: z.coerce.date(),
		heroImage: z.string().optional(),
		platform: z.string().optional()
	}),
});

export const collections = { 
	'blog': blog, 
	'projects': projects
};
