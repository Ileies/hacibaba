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
	<title>{m.shop_reset_password()} - {m.shop_title()}</title>
</svelte:head>

<AuthLayout>
	<Card>
		<CardHeader>
			<CardTitle>{m.shop_reset_password()}</CardTitle>
			<CardDescription>{m.shop_reset_password_desc()}</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if form?.sent}
				<Alert class="text-sm">
					{m.shop_reset_email_sent()}
				</Alert>
			{:else}
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
					<Button type="submit" class="w-full" disabled={loading}>
						{#if loading}<Spinner class="mr-2" />{/if}
						{m.shop_send_reset_link()}
					</Button>
				</form>
			{/if}

			<p class="text-muted-foreground text-center text-sm">
				<a href="/auth/login" class="text-primary font-medium hover:underline">{m.shop_login()}</a>
			</p>
		</CardContent>
	</Card>
</AuthLayout>
