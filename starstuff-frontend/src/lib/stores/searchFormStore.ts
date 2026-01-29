import { get } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { searchStore } from './searchViewModel';

export const MIN_QUERY_LENGTH = 3;
const DEFAULT_DEBOUNCE_MS = 350;

export type ViewMode = 'ranked' | 'grouped';

export const queryStore = writable('');
export const viewModeStore = writable<ViewMode>('ranked');
export const touchedStore = writable(false);

export const isValid = derived(queryStore, ($q) => $q.trim().length >= MIN_QUERY_LENGTH);
export const isTooShort = derived(
	queryStore,
	($q) => $q.length > 0 && $q.length < MIN_QUERY_LENGTH
);
export const showClearIcon = derived(queryStore, ($q) => $q.length > 0);
export const hasValidationError = derived(
	[isTooShort, touchedStore, queryStore],
	([$isTooShort, $touched, $query]) => $isTooShort || ($touched && $query.length === 0)
);

let debounceId: ReturnType<typeof setTimeout> | null = null;

export function cancelDebounce(): void {
	if (debounceId !== null) {
		clearTimeout(debounceId);
		debounceId = null;
	}
}

export function runSearch(baseUrl: URL, q: string, mode: ViewMode): void {
	const trimmed = q.trim();
	if (trimmed.length < MIN_QUERY_LENGTH) return;
	touchedStore.set(true);
	const url = new URL(baseUrl);
	url.searchParams.set('q', trimmed);
	url.searchParams.set('mode', mode);
	goto(url.toString(), { keepFocus: true, noScroll: true });
	mode === 'ranked'
		? searchStore.executeRankedSearch(trimmed)
		: searchStore.executeGroupedSearch(trimmed);
}

export function initFromUrl(url: URL): void {
	const q = url.searchParams.get('q') ?? '';
	const mode = (url.searchParams.get('mode') ?? 'ranked') as ViewMode;
	queryStore.set(q);
	viewModeStore.set(mode);
}

function scheduleDebouncedSearch(getCurrentUrl: () => URL, debounceMs: number): void {
	cancelDebounce();
	const q = get(queryStore).trim();
	const mode = get(viewModeStore);
	if (q.length < MIN_QUERY_LENGTH) return;
	const url = getCurrentUrl();
	const urlQ = url.searchParams.get('q') ?? '';
	const urlMode = (url.searchParams.get('mode') ?? 'ranked') as ViewMode;
	if (q === urlQ && mode === urlMode) return;

	debounceId = setTimeout(() => {
		debounceId = null;
		runSearch(getCurrentUrl(), q, mode);
	}, debounceMs);
}

export function startDebouncedSearch(
	getCurrentUrl: () => URL,
	debounceMs: number = DEFAULT_DEBOUNCE_MS
): () => void {
	const unsubQuery = queryStore.subscribe(() => scheduleDebouncedSearch(getCurrentUrl, debounceMs));
	const unsubMode = viewModeStore.subscribe(() =>
		scheduleDebouncedSearch(getCurrentUrl, debounceMs)
	);

	return () => {
		cancelDebounce();
		unsubQuery();
		unsubMode();
	};
}

export function handleSubmit(currentUrl: URL, e?: Event): void {
	e?.preventDefault();
	cancelDebounce();
	const q = get(queryStore).trim();
	const mode = get(viewModeStore);
	if (q.length >= MIN_QUERY_LENGTH) runSearch(currentUrl, q, mode);
}

export async function handleClear(): Promise<void> {
	cancelDebounce();
	queryStore.set('');
	viewModeStore.set('ranked');
	touchedStore.set(false);
	searchStore.clearSearch();
	await goto('/', { keepFocus: true, noScroll: true });
}

export function setTouched(): void {
	touchedStore.set(true);
}
