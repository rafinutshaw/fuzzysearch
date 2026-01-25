<script lang="ts">
  import { searchStore } from '$lib/stores/searchViewModel';
  
  let query = '';
  let viewMode: 'ranked' | 'grouped' = 'ranked';
  let touched = false;

  $: isTooShort = query.length > 0 && query.length < 3;
  $: isValid = query.trim().length >= 3;

  function handleSubmit() {
    touched = true;
    if (isValid) {
      searchStore.executeSearch(query, viewMode);
    }
  }
</script>

<div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
    <div class="md:col-span-7">
      <label for="search" class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Search Query</label>
      <input 
        id="search"
        type="text" 
        bind:value={query}
        on:blur={() => touched = true}
        placeholder="Enter at least 3 characters..."
        class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <div class="md:col-span-3">
      <label for="mode" class="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">View Mode</label>
      <select 
        id="mode"
        bind:value={viewMode}
        class="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 outline-none focus:border-blue-500"
      >
        <option value="ranked">Ranked List</option>
        <option value="grouped">Grouped Accordion</option>
      </select>
    </div>

    <div class="md:col-span-2 flex items-end">
      <button 
        on:click={handleSubmit}
        disabled={!isValid || $searchStore.loading}
        class="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-200 active:scale-95"
      >
        {$searchStore.loading ? '...' : 'Search'}
      </button>
    </div>
  </div>

  {#if isTooShort || (touched && query.length === 0)}
    <p class="text-red-500 text-sm mt-3 flex items-center gap-1 font-medium">
      <span>⚠️</span> Invalid query: please enter at least 3 characters.
    </p>
  {/if}
</div>