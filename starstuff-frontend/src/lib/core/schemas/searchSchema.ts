import { z } from 'zod';

const BasePaginationSchema = z.object({
	totalHits: z.number().int().nonnegative(),
	totalPages: z.number().int().nonnegative(),
	page: z.number().int().min(1),
	hitsPerPage: z.number().int().min(1).max(100)
});

const SearchResultSchema = z.object({
	id: z.uuid(), // Validates it's a proper UUID string
	title: z.string(), // "Anderson - Mraz"
	sub: z.string(), // "Community"
	avatar: z.string().optional(),
	type: z.enum(['users', 'spaces', 'communities']).optional()
});

export const RankedSearchResultSchema = BasePaginationSchema.extend({
	hits: z.array(SearchResultSchema)
});

export const GroupedSearchResultSchema = z.object({
	users: BasePaginationSchema.extend({
		hits: z.array(SearchResultSchema)
	}),
	spaces: BasePaginationSchema.extend({
		hits: z.array(SearchResultSchema)
	}),
	communities: BasePaginationSchema.extend({
		hits: z.array(SearchResultSchema)
	})
});

export type RankedSearchResult = z.infer<typeof RankedSearchResultSchema>;
export type GroupedSearchResult = z.infer<typeof GroupedSearchResultSchema>;
