<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import {
		Button,
		Input,
		Label,
		Card,
		CardHeader,
		CardContent,
		CardTitle,
		CardDescription,
		Alert,
		Separator
	} from '$lib/components/ui';
	import AuthLayout from '$lib/components/AuthLayout.svelte';
	import GoogleOAuthButton from '$lib/components/GoogleOAuthButton.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as m from '$lib/messages';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>{m.shop_login()} - {m.shop_title()}</title>
</svelte:head>

<AuthLayout>
	<Card>
		<CardHeader>
			<CardTitle>{m.shop_login()}</CardTitle>
			<CardDescription>{m.shop_login_description()}</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if $page.url.searchParams.get('reset') === 'success'}
				<Alert class="text-sm">{m.shop_reset_success()}</Alert>
			{:else if form?.error}
				<Alert variant="destructive" class="text-sm">
					{m.shop_login_error()}
				</Alert>
			{/if}

			<GoogleOAuthButton />

			<div class="relative">
				<Separator />
				<span
					class="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs"
					>{m.common_or()}</span
				>
			</div>

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
					<Label for="email">{m.shop_email()}</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="ihre@email.de"
						required
						autocomplete="email"
					/>
				</div>
				<div class="space-y-1.5">
					<div class="flex items-center justify-between">
						<Label for="password">{m.admin_password()}</Label>
						<a
							href="/auth/reset"
							class="text-muted-foreground hover:text-primary text-xs hover:underline"
							>{m.shop_forgot_password()}</a
						>
					</div>
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
					{m.shop_login()}
				</Button>
			</form>

			<p class="text-muted-foreground text-center text-sm">
				{m.shop_no_account()}
				<a href="/auth/register" class="text-primary font-medium hover:underline"
					>{m.shop_register()}</a
				>
			</p>
		</CardContent>
	</Card>
</AuthLayout>
