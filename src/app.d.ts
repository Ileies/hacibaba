declare global {
	namespace App {
		interface Locals {
			// Customer session
			customerId: number | null;
			customerName: string | null;
			customerEmail: string | null;
			// Admin session
			isAdmin: boolean;
			// Locale
			locale: string;
		}
	}
}

export {};
