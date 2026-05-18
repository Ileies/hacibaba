declare global {
	namespace App {
		interface Error {
			message: string;
			stack?: string;
		}
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
