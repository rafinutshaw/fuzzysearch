import type { SearchResult } from '../schemas/searchSchema';

export class SearchService {
	async fetchFromApi(query: string): Promise<SearchResult[]> {
		// Replace with actual fetch logic
		const response = await fetch(`/api/search?q=${query}`);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
}

export const searchService = new SearchService();
