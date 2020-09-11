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
  {#each datas as { label, submenu, icon, url_target }, i}
    {#if submenu && Array.isArray(submenu) && submenu.length > 0}
      <div class="navbar-item has-dropdown is-hoverable">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="navbar-link">
          {#if icon && icon.length > 0}
            <span class="icon">
              <i class="fa fa-building" aria-hidden="true" />
            </span>
          {/if}
          <span>{label}</span>
        </a>

        <div class="navbar-dropdown is-boxed is-right">
          {#each submenu as { label, icon, url_target }, i2}
            <a class="navbar-item" href={url_target}>{label}</a>
          {/each}
        </div>
      </div>
    {:else}
      <div class="navbar-item">
        <div class="buttons">
          <a class="bd-tw-button button is-small" href={url_target}>
            {#if icon.length > 0}
              <span class="icon"> <i class={icon} /> </span>
            {/if}
            <span>{label}</span>
          </a>
        </div>
      </div>
    {/if}
  {/each}
{:catch error}
  <span style="color: red">{error.message}</span>
{/await}
