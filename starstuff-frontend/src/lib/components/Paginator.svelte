<script lang="ts">
	export let page: number;
	export let totalPages: number;
	export let loading: boolean = false;
	export let onPageChange: (newPage: number) => void;
</script>

<div class="border-t border-slate-100 bg-slate-50 p-4">
	<div class="flex items-center justify-between py-3">
		<div class="text-sm text-slate-500">
			Showing page <span class="font-semibold text-slate-700">{page}</span> of {totalPages}
		</div>
		<div class="flex gap-2">
			<button
				class="rounded border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
				disabled={page === 1 || loading}
				on:click={() => onPageChange(page - 1)}
			>
				Prev
			</button>
			<button
				class="rounded border border-slate-300 px-3 py-1 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
				on:click={() => onPageChange(page + 1)}
				disabled={loading || page >= totalPages}
			>
				Next
			</button>
		</div>
	</div>
</div>
