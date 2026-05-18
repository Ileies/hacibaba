<script lang="ts">
	import { page } from '$app/stores';
</script>

<div
	style="font-family: monospace; padding: 2rem; background: #1a1a1a; color: #f00; min-height: 100vh;"
>
	<h1 style="color: #ff4444; font-size: 1.5rem; margin-bottom: 1rem;">
		{$page.status} - {$page.error?.message ?? 'Unknown error'}
	</h1>
	{#if $page.error?.stack}
		<pre
			style="background: #111; color: #ff8888; padding: 1rem; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; font-size: 0.85rem;">{$page
				.error.stack}</pre>
	{/if}
	<p style="color: #888; margin-top: 1rem; font-size: 0.75rem;">
		{$page.url.pathname}
	</p>
</div>
