<script lang="ts">
  import Search from '$lib/components/Search.svelte';
  import Results from '$lib/components/Results.svelte';
  import { searchStore } from '$lib/stores/searchViewModel';
</script>

<div class="min-h-screen bg-slate-50 pb-20">

  <main class="max-w-4xl mx-auto px-4 mt-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Search Portal</h1>
      <p class="text-slate-500 mt-2">Filter and manage your data across categories.</p>
    </div>

    <Search />

    <Results 
      results={$searchStore.results} 
      mode={$searchStore.mode} 
    />
  </main>
</div>