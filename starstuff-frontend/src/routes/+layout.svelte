<script lang="ts">
  import "./layout.css"; // Ensure Tailwind is imported here
  import Header from "$lib/components/Header.svelte";
  
  export let data;
</script>

<div class="min-h-screen bg-slate-50">
  <Header />
  
  <slot />
</div>