import { writable } from 'svelte/store';
import { searchUseCase, type GroupedResults } from '$lib/core/useCases/searchUseCase';
import type { SearchResult } from '$lib/core/schemas/searchSchema';

interface SearchState {
	results: SearchResult[] | GroupedResults | null;
	loading: boolean;
	error: string | null;
	mode: 'ranked' | 'grouped';
}

function createSearchStore() {
	const { subscribe, set, update } = writable<SearchState>({
		results: null,
		loading: false,
		error: null,
		mode: 'ranked'
	});

	return {
		subscribe,
		async executeSearch(query: string, mode: 'ranked' | 'grouped') {
			update((s) => ({ ...s, loading: true, error: null, mode }));

			try {
				const data = await searchUseCase(query, mode);
				update((s) => ({ ...s, results: data, loading: false }));
			} catch (err: any) {
				update((s) => ({ ...s, error: err.message, loading: false, results: null }));
			}
		}
	};
}

export const searchStore = createSearchStore();
