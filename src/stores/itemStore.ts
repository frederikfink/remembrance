import { supabase } from '$lib/db';
import { writable } from 'svelte/store';

export const items: any = writable([]);

export const loadItems = async () => {
	const { data, error } = await supabase.from('test').select().order('id', { ascending: false });

	if (data == null) throw new Error('');

	items.set(data);

	const subscription = supabase
		.channel('*')
		.on('postgres_changes', { event: '*', schema: '*' }, (payload) => {
			items.set([...data, payload.new]);
			loadItems();
		})
		.subscribe();
};
