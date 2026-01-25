import { searchService } from '../services/SearchService';
import { SearchResultSchema, type SearchResult } from '../schemas/searchSchema';
import { z } from 'zod';

// Define a type for the Grouped result structure
export type GroupedResults = Record<string, SearchResult[]>;

/**
 * Orchestrates the search flow:
 * Fetch -> Validate -> Transform
 */
export async function searchUseCase(
	query: string,
	mode: 'ranked' | 'grouped'
): Promise<SearchResult[] | GroupedResults> {
	// 1. Call the Service
	const rawData = await searchService.fetchFromApi(query);

	// 2. Validate the data using the Zod Schema
	// This ensures the API response matches our TypeScript expectations
	const validatedData = z.array(SearchResultSchema).parse(rawData);

	// 3. Apply Business Logic / Transformations
	if (mode === 'grouped') {
		return transformToGroups(validatedData);
	}

	// Return ranked (flat) results
	return validatedData;
}

/**
 * Helper logic specific to the business requirement of "Grouped" results
 */
function transformToGroups(data: SearchResult[]): GroupedResults {
	return data.reduce((acc, item) => {
		const key = item.category;
		if (!acc[key]) acc[key] = [];
		acc[key].push(item);
		return acc;
	}, {} as GroupedResults);
}
