import { searchService } from '../services/SearchService';
import {
	GroupedSearchResultSchema,
	RankedSearchResultSchema,
	type GroupedSearchResult,
	type RankedSearchResult
} from '../schemas/searchSchema';
import { z } from 'zod';

// Define a type for the Grouped result structure

/**
 * Orchestrates the search flow:
 * Fetch -> Validate -> Transform
 */
export async function searchUseCase(
	query: string,
	mode: 'ranked' | 'grouped'
): Promise<RankedSearchResult | GroupedSearchResult> {
	let rawData;
	if (mode === 'ranked') rawData = await searchService.fetchRankedResults(query);
	else rawData = await searchService.fetchGroupedResults(query);

	const schema = mode === 'ranked' ? RankedSearchResultSchema : GroupedSearchResultSchema;

	// .parse returns the data with the correct TypeScript type inferred
	const validatedData = schema.parse(rawData);
	// Return ranked (flat) results
	return validatedData;
}
