import { env } from '$env/dynamic/public';
import type { GroupedSearchResult, RankedSearchResult } from '../schemas/searchSchema';

const API_BASE = env.PUBLIC_BACKEND_API_URL ?? 'http://localhost:3000';

export class SearchService {
	async fetchSearchResults(
		query: string,
		page: number,
		index: string,
		mode: 'grouped' | 'ranked' = 'grouped'
	): Promise<GroupedSearchResult | RankedSearchResult> {
		const response = await fetch(
			`${API_BASE}/api/search?q=${encodeURIComponent(query)}&page=${page}&index=${encodeURIComponent(index)}&mode=${mode}`
		);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
}

export const searchService = new SearchService();
