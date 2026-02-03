import { searchService } from '../services/SearchService';
import {
	GroupedSearchResultSchema,
	RankedSearchResultSchema,
	type GroupedSearchResult,
	type RankedSearchResult
} from '../schemas/searchSchema';
import { ZodError } from 'zod';

type SearchResultUseCase = {
	results: RankedSearchResult | GroupedSearchResult | null;
	error: string | null;
};

function errorHandler(error: unknown, defaultMessage: string): string {
	if (error instanceof ZodError) return defaultMessage;
	return error instanceof Error ? error.message : defaultMessage;
}

export async function searchUseCase(
	query: string,
	page: number,
	index: string,
	mode: 'grouped' | 'ranked'
): Promise<SearchResultUseCase> {
	try {
		let rawData = await searchService.fetchSearchResults(query, page, index, mode);
		const validatedData =
			mode === 'ranked'
				? RankedSearchResultSchema.parse(rawData)
				: GroupedSearchResultSchema.parse(rawData);
		return { results: validatedData, error: null };
	} catch (error) {
		return {
			results: null,
			error: errorHandler(error, 'Something went wrong while parsing search results')
		};
	}
}
