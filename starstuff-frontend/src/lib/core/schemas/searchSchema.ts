import { z } from 'zod';

export const SearchResultSchema = z.object({
	id: z.number(),
	name: z.string(),
	category: z.string()
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
