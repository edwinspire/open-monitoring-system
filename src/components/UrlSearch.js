import { onMount } from 'svelte';

export function UrlSearch(search) {
  let searchParams = new URLSearchParams(new URL(window.location.href).search);
  console.log(search);
  return searchParams.get(search);
}
