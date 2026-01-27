import type { GroupedSearchResult, RankedSearchResult } from '../schemas/searchSchema';

export class SearchService {
	async fetchRankedResults(query: string, page: number): Promise<RankedSearchResult> {
		// Replace with actual fetch logic
		const response = await fetch(
			`http://localhost:3000/api/search/ranked?q=${query}&&page=${page}`
		);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
	async fetchGroupedResults(
		query: string,
		page: number,
		index: string
	): Promise<GroupedSearchResult> {
		// Replace with actual fetch logic
		const response = await fetch(
			`http://localhost:3000/api/search/grouped?q=${query}&&page=${page}&&index=${index}`
		);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
}

export const searchService = new SearchService();
