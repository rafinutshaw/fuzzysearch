<script lang="ts">
	export let count = 10;
</script>

<div class="divide-y divide-slate-100">
	{#each Array(count) as _}
		<div class="flex animate-pulse items-center justify-between p-4">
			<div class="h-5 w-48 rounded bg-slate-200"></div>
			<div class="h-6 w-16 rounded bg-slate-100"></div>
		</div>
	{/each}
</div>
