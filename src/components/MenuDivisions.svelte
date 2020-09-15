<script>
  import { FetchData } from "./FetchData.js";
  import { onMount } from 'svelte';

  let FData = new FetchData();
  let promise = new Promise(()=>{}, ()=>{});

  async function GetDivisions(search) {
    let query = {};
    const res = await FData.get("/pgapi/v2/divisions", query, {
      "Content-Type": "application/json",
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }

  onMount(async () => {
    promise = GetDivisions();
	});



</script>

<style>

</style>

<div class="navbar-item has-dropdown is-hoverable ">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="navbar-link">
    <span class="icon">
      <i class="fa fa-building" aria-hidden="true" />
    </span>
    <span>Companías</span>
  </a>

  <div class="navbar-dropdown is-boxed is-right">
    {#await promise}
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="is-loading">Cargando...</a>
    {:then datas}
      {#each datas as { iddivision, name }, i}
        <a class="navbar-item" href="/monitor?iddivision={iddivision}&nocachets={Math.random()}{new Date().getTime()} ">{name}</a>
      {/each}
    {:catch error}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a style="color: red" class="is-loading">{error.message}</a>
    {/await}

  </div>
</div>
