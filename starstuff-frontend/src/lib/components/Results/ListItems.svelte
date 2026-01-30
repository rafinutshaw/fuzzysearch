<script lang="ts">
	import type { SearchItems } from '$lib/core/schemas/searchSchema';
	import Loading from './Loading.svelte';
	import NoResults from './NoResults.svelte';

	export let items: SearchItems[] | null;
	export let loading: boolean = false;
	export let loadingCount: number = 3;
</script>

<div class="divide-y divide-slate-100">
	{#if !loading}
		{#each items as item}
			<div class="flex items-center justify-between p-4 transition-colors hover:bg-slate-50">
				<span class="font-semibold text-slate-800">{item.title} <span class="text-xs"> (Rank: {item.popularity})</span></span>
				{#if item.type}
					<span
						class="rounded bg-blue-50 px-2 py-1 text-xs font-bold tracking-wider text-blue-500 uppercase"
					>
						{item.type}
					</span>
				{/if}
			</div>
		{/each}
		{#if items?.length == 0}
			<NoResults />
		{/if}
	{/if}
	{#if loading}
		<Loading count={loadingCount} />
	{/if}
</div>
