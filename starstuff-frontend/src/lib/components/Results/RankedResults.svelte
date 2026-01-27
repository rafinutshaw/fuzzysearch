<script lang="ts">
	import { page } from '$app/state';
	import type { RankedSearchResult } from '$lib/core/schemas/searchSchema';
	import { searchStore } from '$lib/stores/searchViewModel';
	import Paginator from '../Paginator.svelte';
	import ListItems from './ListItems.svelte';

	let loading = $derived($searchStore.loading);
	let results = $derived($searchStore.results);
	let query = $derived(page.url.searchParams.get('q') || '');
	let mode = $derived(page.url.searchParams.get('mode') || '');

	async function handlePagination(newPage: number) {
		searchStore.executeRankedSearch(query, newPage);
	}

	function isRanked(res: any): res is RankedSearchResult {
		return mode === 'ranked' && res !== null && 'hits' in res;
	}

	function getItems() {
		if (results && 'hits' in results) return results.hits;
		return [];
	}
</script>

<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<ListItems items={getItems()} {loading} loadingCount={10} />

	{#if isRanked(results)}
		<Paginator
			{loading}
			totalPages={results.totalPages}
			page={results.page}
			onPageChange={(newPage) => handlePagination(newPage)}
		/>
	{/if}
</div>
