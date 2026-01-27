<script lang="ts">
	import Results from '$lib/components/Results/Results.svelte';
	import Search from '$lib/components/Search.svelte';
	import { searchStore } from '$lib/stores/searchViewModel';
</script>

<div class="bg-slate-50 pb-20">
	<main class="mx-auto mt-12 max-w-4xl px-4">
		<div class="mb-8">
			<h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Search Portal</h1>
			<p class="mt-2 text-slate-500">Filter and manage your data across categories.</p>
		</div>

		<Search />

		<Results results={$searchStore.results} />
	</main>
</div>
