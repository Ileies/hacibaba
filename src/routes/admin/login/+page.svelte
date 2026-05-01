<script lang="ts">
	import type { ActionData } from './$types';
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

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin - {m.shop_title()}</title>
</svelte:head>

<AuthLayout
	fullScreen
	subtitle={m.admin_title()}
	subtitleClass="text-xs text-muted-foreground uppercase tracking-widest"
>
	<Card>
		<CardHeader>
			<CardTitle>{m.admin_login()}</CardTitle>
			<CardDescription>{m.admin_title()}</CardDescription>
		</CardHeader>
		<CardContent>
			{#if form?.error}
				<Alert variant="destructive" class="mb-4 text-sm">
					{m.admin_login_error()}
				</Alert>
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
				class="space-y-4"
			>
				<div class="space-y-1.5">
					<Label for="username">{m.admin_username()}</Label>
					<Input id="username" name="username" type="text" required autocomplete="username" />
				</div>
				<div class="space-y-1.5">
					<Label for="password">{m.admin_password()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="current-password"
					/>
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}<Spinner class="mr-2" />{/if}
					{m.admin_login()}
				</Button>
			</form>
		</CardContent>
	</Card>
</AuthLayout>
