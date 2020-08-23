<script>
  import { FetchData } from "./FetchData.js";
  import { createEventDispatcher } from "svelte";
  export let url;
  export let query;
  export let selected;

  let FData = new FetchData();
  let promise = fetchData(url);
  const dispatch = createEventDispatcher();

  function HandleOnChange(e) {
    console.log(e, selected);
    dispatch("value", { value: selected });
  }

  async function fetchData() {
    console.log(url, selected, query);

    const res = await FData.get(url, query, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }
</script>

<style>
  .full {
    width: 100%;
  }
</style>

<div class="field">
  <div class="control">
    <div class="select is-small full">
      <select class="full" bind:value={selected} on:blur={HandleOnChange}>

        {#await promise}
          <option disabled>Cargando...</option>
        {:then datas}
          {#each datas as { label, value, disabled }, i}
            {#if { value }.toString().localeCompare({ selected }.toString())}
              <option {disabled} {value} selected="selected">{label}</option>
            {:else}
              <option {disabled} {value}>{label}</option>
            {/if}
          {/each}
        {:catch error}
          <option disabled>Error...</option>
        {/await}

      </select>
    </div>
  </div>
</div>
