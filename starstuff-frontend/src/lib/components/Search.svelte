<script lang="ts">
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		queryStore,
		viewModeStore,
		isValid,
		showClearIcon,
		hasValidationError,
		initFromUrl,
		runSearch,
		startDebouncedSearch,
		handleSubmit,
		handleClear,
		setTouched,
		MIN_QUERY_LENGTH
	} from '$lib/stores/searchFormStore';

	onMount(() => {
		initFromUrl(page.url);
		const q = get(queryStore).trim();
		const mode = get(viewModeStore);
		if (q.length >= MIN_QUERY_LENGTH) runSearch(page.url, q, mode);
		return startDebouncedSearch(() => page.url);
	});
</script>

<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
	<form onsubmit={(e) => handleSubmit(page.url, e)}>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-12">
			<div class="md:col-span-7">
				<label for="search" class="mb-2 ml-1 block text-xs font-bold text-slate-500 uppercase"
					>Search Query</label
				>
				<div class="relative">
					<input
						id="search"
						type="text"
						bind:value={$queryStore}
						onblur={setTouched}
						placeholder="Enter at least 3 characters..."
						class="w-full rounded-lg border border-slate-300 py-3 pr-10 pl-4 transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
					/>
					{#if $showClearIcon}
						<button
							type="button"
							onclick={handleClear}
							class="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
							title="Clear search"
							aria-label="Clear search"
						>
							<svg
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<div class="md:col-span-3">
				<label for="mode" class="mb-2 ml-1 block text-xs font-bold text-slate-500 uppercase"
					>View Mode</label
				>
				<select
					id="mode"
					bind:value={$viewModeStore}
					class="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
				>
					<option value="ranked">Ranked List</option>
					<option value="grouped">Grouped Accordion</option>
				</select>
			</div>

			<div class="flex items-end md:col-span-2">
				<button
					type="submit"
					disabled={!$isValid}
					class="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-md shadow-blue-200 transition-colors hover:bg-blue-700 active:scale-95 disabled:bg-slate-300"
				>
					Search
				</button>
			</div>
		</div>
	</form>
</div>
