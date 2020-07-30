<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import ToolBar from "../../components/ToolBar.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { IdAccount, APPLocalStorage } from "../../components/Stores.js";
  import { space } from "svelte/internal";

  export let segment;
  let FData = new FetchData();
  let promise = Promise.resolve([]);
  let idaccount = 0;
  let search = "";

  function ClickAddContact() {
    window.location.href = "/contact?idaccount=" + idaccount;
  }

  function handleClickSearch(e) {
    console.log(e);
    promise = GetData(e.detail.text);
  }

  async function GetData(search) {
    console.log(idaccount, search);
    const res = await FData.get(
      "/api/contacts_r",
      { idaccount: idaccount, search: search },
      {
        "Content-Type": "application/json",
      }
    );

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }

  onMount(async () => {
    let AppLS = new APPLocalStorage();
    idaccount = AppLS.getUser().idaccount;
  });
</script>

<style>
  .root {
    padding: 0.5em;
  }
  .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }
</style>

<Menu {segment} on:search={handleClickSearch} ShowSearch="true" ShowR5="true">
  <span slot="Title">
    <i class="fas fa-users fa-lg " />
    CONTACTOS
  </span>

  <span slot="R5" class="icon_link" on:click={ClickAddContact}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="icon">
      <i class="fas fa-plus fa-lg" />
    </a>
  </span>
</Menu>

<div class="columns is-multiline is-mobile root">
  {#await promise}
    <p>...waiting</p>
  {:then datas}
    {#each datas as { idcontact, flname, lastname, lfname, identification, identificationtype_label }, i}
      <div
        class="column is-half-mobile is-one-third-tablet is-one-quarter-fullhd
        is-one-quarter-widescreen is-one-quarter-desktop">

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{lfname.toUpperCase()}</p>
            <span class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-user" />
              </span>
            </span>
          </header>
          <div class="card-content">
            <div class="columns is-multiline is-mobile">
              <div
                class="column is-half-tablet is-half-mobile is-half-fullhd
                is-half-widescreen is-half-desktop">
                <span class="field">
                  <label class="label is-small">Identificación</label>
                  <span class="control is-small">
                    <input
                      type="text"
                      class="input is-small"
                      value={identification}
                      readonly />
                  </span>
                </span>

              </div>

              <div
                class="column is-half-tablet is-half-mobile is-half-fullhd
                is-half-widescreen is-half-desktop">
                <span class="field">
                  <label class="label is-small">Tipo Identificación</label>
                  <div class="control is-small">
                    <input
                      type="text"
                      class="input is-small"
                      value={identificationtype_label}
                      readonly />
                  </div>
                </span>
              </div>

            </div>
          </div>
          <footer class="card-footer">
            <a href="/contact?idcontact={idcontact}" class="card-footer-item">
              Editar
            </a>
            <a href="/#" class="card-footer-item">Eliminar</a>
          </footer>
        </div>

      </div>

      <!-- <User {...{ login, url }} /> -->
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

</div>
