<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { searchStore } from '$lib/stores/searchViewModel';
	import { onMount } from 'svelte';

	let viewMode = $state(page.url.searchParams.get('mode') || 'ranked');
	let touched = $state(false);
	let query = $state(page.url.searchParams.get('q') || '');
	let isTooShort = $derived(query.length > 0 && query.length < 3);
	let isValid = $derived(query.trim().length >= 3);

	onMount(() => {
		if (query) {
			handleSubmit();
		}
	});
	async function handleSubmit(e?: Event) {
		e?.preventDefault();
		touched = true;
		const url = new URL(page.url);
		url.searchParams.set('q', query);
		url.searchParams.set('mode', viewMode);
		await goto(url.toString(), { keepFocus: true, noScroll: true });
		if (isValid) {
			viewMode === 'ranked'
				? searchStore.executeRankedSearch(query)
				: searchStore.executeGroupedSearch(query);
		}
	}
</script>

<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
	<form onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-12">
			<div class="md:col-span-7">
				<label for="search" class="mb-2 ml-1 block text-xs font-bold text-slate-500 uppercase"
					>Search Query</label
				>
				<input
					id="search"
					type="text"
					defaultValue={query}
					bind:value={query}
					onblur={() => (touched = true)}
					placeholder="Enter at least 3 characters..."
					class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
				/>
			</div>

			<div class="md:col-span-3">
				<label for="mode" class="mb-2 ml-1 block text-xs font-bold text-slate-500 uppercase"
					>View Mode</label
				>
				<select
					id="mode"
					bind:value={viewMode}
					class="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
				>
					<option value="ranked">Ranked List</option>
					<option value="grouped">Grouped Accordion</option>
				</select>
			</div>

			<div class="flex items-end md:col-span-2">
				<button
					onclick={handleSubmit}
					disabled={!isValid}
					class="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md shadow-blue-200 transition-colors hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
				>
					Search
				</button>
			</div>
		</div>
	</form>

	{#if isTooShort || (touched && query.length === 0)}
		<p class="mt-3 flex items-center gap-1 text-sm font-medium text-red-500">
			<span>⚠️</span> Invalid query: please enter at least 3 characters.
		</p>
	{/if}
</div>
