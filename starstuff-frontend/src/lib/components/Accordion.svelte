<script lang="ts">
	export let open = false;
</script>

<details {open} class="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<summary
		class="flex cursor-pointer list-none items-center justify-between bg-slate-100 p-4 select-none hover:bg-slate-50"
	>
		<div class="flex items-center gap-2">
			<slot name="header" />
		</div>

		<div class="flex items-center gap-3">
			<slot name="tail" />
			<span class="text-slate-400 transition-transform group-open:rotate-180">▼</span>
		</div>
	</summary>

	<slot />
</details>
