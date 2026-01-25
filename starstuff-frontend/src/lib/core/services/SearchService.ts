import type { GroupedSearchResult, RankedSearchResult } from '../schemas/searchSchema';

export class SearchService {
	async fetchRankedResults(query: string): Promise<RankedSearchResult> {
		// Replace with actual fetch logic
		const response = await fetch(`http://localhost:3000/api/search/ranked?q=${query}`);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
	async fetchGroupedResults(query: string): Promise<GroupedSearchResult> {
		// Replace with actual fetch logic
		const response = await fetch(`http://localhost:3000/api/search/grouped?q=${query}`);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
}

export const searchService = new SearchService();
