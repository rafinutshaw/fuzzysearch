import { env } from '$env/dynamic/public';
import type { GroupedSearchResult, RankedSearchResult } from '../schemas/searchSchema';

const API_BASE = env.BACKEND_API_URL ?? 'http://localhost:3000';

export class SearchService {
	async fetchRankedResults(query: string, page: number): Promise<RankedSearchResult> {
		const response = await fetch(
			`${API_BASE}/api/search/ranked?q=${encodeURIComponent(query)}&page=${page}`
		);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
	async fetchGroupedResults(
		query: string,
		page: number,
		index: string
	): Promise<GroupedSearchResult> {
		const response = await fetch(
			`${API_BASE}/api/search/grouped?q=${encodeURIComponent(query)}&page=${page}&index=${encodeURIComponent(index)}`
		);
		if (!response.ok) throw new Error('Network error');
		return response.json();
	}
}

export const searchService = new SearchService();
