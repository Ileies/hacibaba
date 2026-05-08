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
	<title>{m.shop_register()} - {m.shop_title()}</title>
</svelte:head>

<AuthLayout>
	<Card>
		<CardHeader>
			<CardTitle>{m.shop_create_account()}</CardTitle>
			<CardDescription>{m.shop_register_description()}</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if form?.error === 'email_taken'}
				<Alert variant="destructive" class="text-sm">
					{m.shop_email_taken()}
				</Alert>
			{:else if form?.error}
				<Alert variant="destructive" class="text-sm">
					{m.shop_fill_required_fields()}
				</Alert>
			{/if}

			<GoogleOAuthButton label={m.shop_register_with_google()} />

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
				<div class="grid grid-cols-2 gap-3">
					<div class="space-y-1.5">
						<Label for="firstName">{m.shop_first_name()}</Label>
						<Input
							id="firstName"
							name="firstName"
							type="text"
							placeholder="Max"
							required
							autocomplete="given-name"
							value={form?.firstName ?? ''}
						/>
					</div>
					<div class="space-y-1.5">
						<Label for="lastName">{m.shop_last_name()}</Label>
						<Input
							id="lastName"
							name="lastName"
							type="text"
							placeholder="Mustermann"
							required
							autocomplete="family-name"
							value={form?.lastName ?? ''}
						/>
					</div>
				</div>
				<div class="space-y-1.5">
					<Label for="email">{m.shop_email()}</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="ihre@email.de"
						required
						autocomplete="email"
						value={form?.email ?? ''}
					/>
				</div>
				<div class="space-y-1.5">
					<Label for="password">{m.admin_password()}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autocomplete="new-password"
						placeholder={m.shop_password_min_8()}
					/>
				</div>
				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}<Spinner class="mr-2" />{/if}
					{m.shop_create_account()}
				</Button>
			</form>

			<p class="text-muted-foreground text-center text-sm">
				{m.shop_already_registered()}
				<a href="/auth/login" class="text-primary font-medium hover:underline">{m.shop_login()}</a>
			</p>
		</CardContent>
	</Card>
</AuthLayout>
