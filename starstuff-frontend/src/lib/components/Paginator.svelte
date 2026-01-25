<script lang="ts">
  let page = 1;
</script>

<div class="flex items-center justify-between py-3">
  <div class="text-sm text-slate-500">
    Showing page <span class="font-semibold text-slate-700">{page}</span> of 12
  </div>
  <div class="flex gap-2">
    <button 
      class="px-3 py-1 text-sm font-semibold border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
      disabled={page === 1}
      on:click={() => page--}
    >
      Prev
    </button>
    <button 
      class="px-3 py-1 text-sm font-semibold border border-slate-300 rounded hover:bg-slate-50"
      on:click={() => page++}
    >
      Next
    </button>
  </div>
</div>