import { get, writable } from 'svelte/store';
import { searchUseCase } from '$lib/core/useCases/searchUseCase';
import type { GroupedSearchResult, RankedSearchResult } from '$lib/core/schemas/searchSchema';

interface SearchState {
	results: RankedSearchResult | GroupedSearchResult | null;
	loading: boolean;
	error: string | null;
	loadingIndex: string;
}

function createSearchStore() {
	const { subscribe, update } = writable<SearchState>({
		results: null,
		loading: false,
		error: null,
		loadingIndex: ''
	});

	return {
		subscribe,
		getCurrentState: () => get({ subscribe }),
		clearSearch() {
			update((s) => ({
				...s,
				results: null,
				loading: false,
				error: null,
				loadingIndex: ''
			}));
		},
		async executeRankedSearch(query: string, page: number = 1) {
			update((s) => ({ ...s, loading: true, error: null, query, mode: 'ranked' }));

			try {
				const data = await searchUseCase(query, page, '', 'ranked');
				update((s) => ({
					...s,
					error: data.error,
					results: data.results,
					loading: false,
					mode: 'ranked'
				}));
			} catch (err: any) {
				update((s) => ({
					...s,
					error: err.message,
					loading: false,
					results: null,
					mode: 'ranked'
				}));
			}
		},

		async executeGroupedSearch(query: string, page: number = 1, loadingIndex: string = '') {
			update((s) => ({
				...s,
				loading: loadingIndex === '',
				error: null,
				query,
				mode: 'grouped',
				loadingIndex
			}));

			try {
				const data = await searchUseCase(query, page, loadingIndex, 'grouped');
				if (!loadingIndex)
					update((s) => ({
						...s,
						error: data.error,
						results: data.results,
						loading: false,
						mode: 'grouped',
						loadingIndex: ''
					}));
				else {
					update((s) => ({
						...s,
						results: { ...s.results, ...data.results },
						loading: false,
						mode: 'grouped',
						loadingIndex: ''
					}));
				}
			} catch (err: any) {
				update((s) => ({ ...s, error: err.message, loading: false, results: null }));
			}
		}
	};
}

export const searchStore = createSearchStore();
