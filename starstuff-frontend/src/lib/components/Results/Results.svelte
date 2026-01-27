<script lang="ts">
	import { page } from '$app/state';
	import type { GroupedSearchResult, RankedSearchResult } from '$lib/core/schemas/searchSchema';
	import { searchStore } from '$lib/stores/searchViewModel';
	import GroupedResults from './GroupedResults.svelte';
	import RankedResults from './RankedResults.svelte';

	let { results }: { results: RankedSearchResult | GroupedSearchResult | null } = $props();
	let mode = $derived(page.url.searchParams.get('mode') || 'ranked');
	let query = $derived(page.url.searchParams.get('q') || '');
</script>

<div class="mt-8">
	{#if results === null && !$searchStore.loading && !query}
		<div
			class="rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 py-20 text-center text-slate-400"
		>
			Start a search to see results
		</div>
	{:else if mode === 'grouped'}
		<GroupedResults />
	{:else}
		<RankedResults />
	{/if}
</div>
