interface RateLimit {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimit>();

// Clean up expired entries every 10 minutes
setInterval(
	() => {
		const now = Date.now();
		for (const [key, entry] of store) {
			if (entry.resetAt < now) store.delete(key);
		}
	},
	10 * 60 * 1000
);

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || entry.resetAt < now) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}

	if (entry.count >= maxRequests) return false;

	entry.count++;
	return true;
}
