<script>
  import { FetchData } from "./FetchData.js";
  import { onMount } from 'svelte';

  let FData = new FetchData();
  let promise = new Promise(()=>{}, ()=>{});

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

  onMount(async () => {
    promise = GetMenu();
	});

</script>

{#await promise}
  <span>-</span>
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
          {#each submenu as { label, icon, url_target, isseparator }, i2}
            {#if isseparator}
              <hr class="navbar-divider" />
            {:else}
              <a class="navbar-item" href={url_target}>
                {#if icon && icon.length > 0}
                  <span class="icon">
                    <i class={icon} aria-hidden="true" />
                  </span>
                {/if}
                <span>{label}</span>
              </a>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <div class="navbar-item">
        <div class="buttons">
          <a class="bd-tw-button button is-small is-light" href={url_target}>
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
  <span style="color: red">-</span>
{/await}
