import { searchService } from '../services/SearchService';
import {
	GroupedSearchResultSchema,
	RankedSearchResultSchema,
	type GroupedSearchResult,
	type RankedSearchResult
} from '../schemas/searchSchema';

// Define a type for the Grouped result structure

/**
 * Orchestrates the search flow:
 * Fetch -> Validate -> Transform
 */
export async function rankedSearchUseCase(
	query: string,
	page: number
): Promise<RankedSearchResult | GroupedSearchResult> {
	let rawData = await searchService.fetchRankedResults(query, page);
	// .parse returns the data with the correct TypeScript type inferred
	const validatedData = RankedSearchResultSchema.parse(rawData);
	// Return ranked (flat) results
	return validatedData;
}

export async function groupedSearchUseCase(
	query: string,
	page: number,
	index: string
): Promise<RankedSearchResult | GroupedSearchResult> {
	let rawData = await searchService.fetchGroupedResults(query, page, index);
	// .parse returns the data with the correct TypeScript type inferred
	const validatedData = GroupedSearchResultSchema.parse(rawData);
	// Return ranked (flat) results
	return validatedData;
}
