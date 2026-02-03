<script lang="ts">
	import { page } from '$app/state';
	import { searchStore } from '$lib/stores/searchViewModel';
	import GroupedResults from './GroupedResults.svelte';
	import RankedResults from './RankedResults.svelte';

	let mode = $derived(page.url.searchParams.get('mode') || 'ranked');
	let query = $derived(page.url.searchParams.get('q') || '');
</script>

<div class="mt-8">
	{#if !$searchStore.loading && !query}
		<div
			class="rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 py-20 text-center text-slate-400"
		>
			Start a search to see results
		</div>
	{:else if $searchStore.error}
		<div
			class="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 font-bold text-red-400 shadow-sm"
		>
			{$searchStore.error}
		</div>
	{:else if mode === 'grouped' && !$searchStore.error}
		<GroupedResults />
	{:else}
		<RankedResults />
	{/if}
</div>
