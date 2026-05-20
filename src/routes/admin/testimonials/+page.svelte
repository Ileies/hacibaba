<script lang="ts">
	import type { PageData } from './$types';
	import {
		Button,
		Badge,
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from '$lib/components/ui';
	import { Plus, Pencil, Star } from '@lucide/svelte';
	import * as m from '$lib/messages';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{m.admin_testimonials()} - Admin</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold tracking-tight">{m.admin_testimonials()}</h1>
	<Button href="/admin/testimonials/new" size="sm">
		<Plus size={14} />
		{m.admin_new_testimonial()}
	</Button>
</div>

<div class="border-border bg-card overflow-hidden rounded-lg border">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>{m.admin_testimonial_name()}</TableHead>
				<TableHead>{m.admin_testimonial_rating()}</TableHead>
				<TableHead class="hidden md:table-cell">{m.admin_testimonial_text()}</TableHead>
				<TableHead>{m.admin_active()}</TableHead>
				<TableHead class="w-10"></TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.testimonials as t (t.id)}
				<TableRow>
					<TableCell class="text-sm font-medium">
						{t.name}
						{#if t.location}
							<span class="text-muted-foreground font-normal"> · {t.location}</span>
						{/if}
					</TableCell>
					<TableCell>
						<div class="flex items-center gap-0.5">
							{#each [0, 1, 2, 3, 4] as i (i)}
								<Star
									size={12}
									class={i < t.rating
										? 'fill-amber-400 text-amber-400'
										: 'text-muted-foreground/30'}
								/>
							{/each}
						</div>
					</TableCell>
					<TableCell class="text-muted-foreground hidden max-w-xs truncate text-sm md:table-cell"
						>{t.text}</TableCell
					>
					<TableCell>
						<Badge variant={t.isActive ? 'default' : 'outline'}>
							{t.isActive ? m.admin_active() : m.admin_inactive()}
						</Badge>
					</TableCell>
					<TableCell>
						<a
							href="/admin/testimonials/{t.id}"
							aria-label="{m.common_edit()}: {t.name}"
							class="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors"
						>
							<Pencil size={13} />
						</a>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
