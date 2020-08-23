<script>
  export let iddivision;
  export let name;
  //export let selected;
  import { FetchData } from "./FetchData.js";

  let FData = new FetchData();
  let promise = fetchData(iddivision);

  async function fetchData(id) {
    console.log(id);
    const res = await FData.get(
      "/pgapi/events/view_datas_details_summay_by_eventtype",
      { iddivision: iddivision },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }
</script>

<style>
.tag_width{
  width: fit-content;
  margin-bottom: .1em;
}
</style>

<div class="card">
  <header class="card-header">
    {#if iddivision == 0}
    <span class="card-header-title gbackground-blue"><a href="/system">{name}</a></span>
    {:else}
    <span class="card-header-title gbackground-blue"><a href="/monitor?iddivision={iddivision}">{name}</a></span>
    {/if}
  </header>
  <div class="card-content">
    <div class="content">
      {#await promise}
        <option disabled>Consultando datos</option>
      {:then datas}
        {#if Array.isArray( datas )}
          {#each datas as data, i}
            <span class="tags has-addons tag_width">
              <span class="tag">{data.label_eventtype}</span>
              <span class="tag is-primary">{data.countevents}</span>
            </span>
          {/each}
        {:else}
          <div disabled>No hay datos</div>
        {/if}
      {:catch error}
        <div disabled>Error...</div>
      {/await}
    </div>
  </div>

</div>
