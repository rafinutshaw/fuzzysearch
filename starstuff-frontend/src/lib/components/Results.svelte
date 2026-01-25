<script lang="ts">
  import Paginator from './Paginator.svelte';
  import type { SearchResult } from '$lib/core/schemas/searchSchema';
  import type { GroupedResults } from '$lib/core/useCases/searchUseCase';

  export let results: SearchResult[] | GroupedResults | null;
  export let mode: 'ranked' | 'grouped';

  // Type Guard
  function isGrouped(res: any): res is GroupedResults {
    return mode === 'grouped' && res !== null && !Array.isArray(res);
  }
</script>

<div class="mt-8">
  {#if !results}
    <div class="text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
      Start a search to see results
    </div>
  {:else if isGrouped(results)}
    <div class="space-y-3">
      {#each Object.entries(results) as [category, items]}
        <details class="group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 list-none select-none">
            <h3 class="font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              {category}
            </h3>
            <div class="flex items-center gap-3">
              <span class="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                {items.length} hits
              </span>
              <span class="transition-transform group-open:rotate-180 text-slate-400">▼</span>
            </div>
          </summary>
          <div class="p-4 bg-slate-50/50 border-t border-slate-100">
            <div class="space-y-2 mb-4">
              {#each items as item}
                <div class="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 shadow-sm">
                  {item.name}
                </div>
              {/each}
            </div>
            <Paginator />
          </div>
        </details>
      {/each}
    </div>
  {:else}
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div class="divide-y divide-slate-100">
        {#each results as item}
          <div class="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
            <span class="font-semibold text-slate-800">{item.name}</span>
            <span class="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
              {item.category}
            </span>
          </div>
        {/each}
      </div>
      <div class="p-4 bg-slate-50 border-t border-slate-100">
        <Paginator />
      </div>
    </div>
  {/if}
</div>