import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import db from '$lib/server/db';
import { testimonialsTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = ({ params }) => {
	if (params.id === 'new') return { testimonial: null };
	const id = parseInt(params.id);
	if (isNaN(id)) error(404);
	const testimonial = db.select().from(testimonialsTable).where(eq(testimonialsTable.id, id)).get();
	if (!testimonial) error(404);
	return { testimonial };
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const location = String(data.get('location') ?? '').trim() || null;
		const text = String(data.get('text') ?? '').trim();
		const ratingStr = String(data.get('rating') ?? '5');
		const rating = Math.min(5, Math.max(1, parseInt(ratingStr) || 5));
		const isActive = data.has('isActive');
		const sortOrderStr = String(data.get('sortOrder') ?? '0');
		const sortOrder = parseInt(sortOrderStr) || 0;

		if (!name || !text) return fail(400, { error: true });

		const values = { name, location, text, rating, isActive, sortOrder };

		if (params.id === 'new') {
			db.insert(testimonialsTable).values(values).run();
		} else {
			const id = parseInt(params.id);
			db.update(testimonialsTable).set(values).where(eq(testimonialsTable.id, id)).run();
		}

		return { success: true };
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);
		if (isNaN(id)) return fail(400);
		db.delete(testimonialsTable).where(eq(testimonialsTable.id, id)).run();
		redirect(302, '/admin/testimonials');
	}
};
