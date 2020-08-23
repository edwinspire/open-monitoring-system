<script>
  import { FetchData } from "./FetchData.js";

  let FData = new FetchData();
  let promise = GetDivisions();

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
</script>

<style>

</style>

<div class="navbar-item has-dropdown is-hoverable ">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="navbar-link">
    <span class="icon">
      <i class="fa fa-building" aria-hidden="true" />
    </span>
    <span>Divisiones</span>
  </a>

  <div class="navbar-dropdown is-boxed is-right">
    {#await promise}
      <p>...waiting</p>
    {:then datas}
      {#each datas as { iddivision, name }, i}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="navbar-item">{name}</a>
      {/each}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}

  </div>
</div>
