<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import {
		Button,
		Input,
		Label,
		Card,
		CardHeader,
		CardContent,
		CardTitle,
		CardDescription,
		Alert
	} from '$lib/components/ui';
	import AuthLayout from '$lib/components/AuthLayout.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as m from '$lib/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>{m.shop_set_new_password()} - {m.shop_title()}</title>
</svelte:head>

<AuthLayout>
	<Card>
		<CardHeader>
			<CardTitle>{m.shop_set_new_password()}</CardTitle>
			<CardDescription>{data.email}</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if form?.error === 'mismatch'}
				<Alert variant="destructive" class="text-sm">{m.shop_password_mismatch()}</Alert>
			{:else if form?.error}
				<Alert variant="destructive" class="text-sm">{m.shop_reset_invalid_token()}</Alert>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
				class="space-y-3"
			>
				<div class="space-y-1.5">
					<Label for="password">{m.shop_new_password()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						minlength={8}
						autocomplete="new-password"
					/>
					<p class="text-muted-foreground text-xs">{m.shop_password_min_8()}</p>
				</div>
				<div class="space-y-1.5">
					<Label for="confirm">{m.shop_confirm_password()}</Label>
					<Input
						id="confirm"
						name="confirm"
						type="password"
						required
						minlength={8}
						autocomplete="new-password"
					/>
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}<Spinner class="mr-2" />{/if}
					{m.shop_set_new_password()}
				</Button>
			</form>
		</CardContent>
	</Card>
</AuthLayout>
