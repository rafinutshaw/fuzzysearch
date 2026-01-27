<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { GroupedSearchResult } from '$lib/core/schemas/searchSchema';
	import { searchStore } from '$lib/stores/searchViewModel';
	import Accordion from '../Accordion.svelte';
	import Paginator from '../Paginator.svelte';
	import ListItems from './ListItems.svelte';
	import Loading from './Loading.svelte';

	let loadingIndex = $derived($searchStore.loadingIndex);
	let results = $derived($searchStore.results);
	let query = $derived(page.url.searchParams.get('q') || '');
	let mode = $derived(page.url.searchParams.get('mode') || '');

	async function handlePagination(newPage: number, index: string = '') {
		searchStore.executeGroupedSearch(query, newPage, index);
	}

	function isGrouped(res: any): res is GroupedSearchResult {
		return mode === 'grouped' && res !== null && !Array.isArray(res);
	}
</script>

<div class="space-y-3">
	{#if $searchStore.loading}
		<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<Loading />
		</div>
	{/if}
	{#if isGrouped(results) && !$searchStore.loading}
		{#each Object.entries(results) as [category, items]}
			<Accordion open={items?.hits?.length !== 0}>
				<svelte:fragment slot="header">
					<span class="h-2 w-2 rounded-full bg-blue-500"></span>
					<h3 class="font-bold text-slate-800">{category.toUpperCase()}</h3>
				</svelte:fragment>

				<svelte:fragment slot="tail">
					<span class="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
						{items.totalHits} hits
					</span>
				</svelte:fragment>

				<ListItems items={items.hits} loading={loadingIndex === category} />

				<Paginator
					totalPages={items.totalPages}
					page={items.page}
					onPageChange={(newPage) => handlePagination(newPage, category)}
				/>
			</Accordion>
		{/each}
	{/if}
</div>
