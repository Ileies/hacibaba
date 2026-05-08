<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import {
		Button,
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
	<title>{m.shop_verify_email_title()} - {m.shop_title()}</title>
</svelte:head>

<AuthLayout>
	<Card>
		<CardHeader>
			<CardTitle>{m.shop_verify_email_title()}</CardTitle>
			<CardDescription>
				{#if data.email}
					{m.shop_verify_email_desc({ email: data.email })}
				{:else}
					{m.shop_verify_email_desc({ email: '...' })}
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if data.error === 'invalid'}
				<Alert variant="destructive" class="text-sm">
					{m.shop_verify_email_invalid()}
				</Alert>
			{/if}

			{#if form?.sent}
				<Alert class="text-sm">
					{m.shop_verify_email_resent()}
				</Alert>
			{/if}

			<form
				method="POST"
				action="?/resend"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
				class="space-y-3"
			>
				<input type="hidden" name="email" value={data.email} />
				<Button type="submit" variant="outline" class="w-full" disabled={loading}>
					{#if loading}<Spinner class="mr-2" />{/if}
					{m.shop_verify_email_resend()}
				</Button>
			</form>

			<p class="text-muted-foreground text-center text-sm">
				<a href="/auth/login" class="text-primary font-medium hover:underline">{m.shop_login()}</a>
			</p>
		</CardContent>
	</Card>
</AuthLayout>
