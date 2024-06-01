import { writable } from 'svelte/store';

export const balance = writable(0);

export async function updateBalance() {
	const response = await fetch('/api/sessions');
	if (!response.ok) return;

	const data = await response.json();
	if (!data?.data) return;

	balance.set(data.data.balance);
}
