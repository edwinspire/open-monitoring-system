<script>
  import { FetchData } from "./FetchData.js";

  let FData = new FetchData();
  let promise = GetMenu();

  async function GetMenu(search) {
    let query = {};
    const res = await FData.get("/pgapi/v2/view_menu_submenu", query, {
      "Content-Type": "application/json",
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }
</script>

{#await promise}
<p>...waiting</p>
{:then datas}
{#each datas as { label, submenu }, i}
  
<div class="navbar-item has-dropdown is-hoverable ">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="navbar-link">
    <span class="icon">
      <i class="fa fa-building" aria-hidden="true" />
    </span>
    <span>{label}</span>
  </a>

  <div class="navbar-dropdown is-boxed is-right">  
      {#each submenu as { label }, i2}
        <a class="navbar-item" href="/monitor?iddivision={i2}">{label}</a>
      {/each}

  </div>
</div>
{/each}
{:catch error}
<span style="color: red">{error.message}</span>
{/await}




