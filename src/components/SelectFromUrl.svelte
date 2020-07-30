<script>
  export let url;
  export let query;
  export let selected;
  import { FetchData } from "./FetchData.js";

  let FData = new FetchData();
  let promise = fetchData(url);

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
  .full{
    width: 100%;
  }
</style>

<div class="field">
  <div class="control">
    <div class="select is-small full">
      <select class="full" bind:value={selected}>

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
