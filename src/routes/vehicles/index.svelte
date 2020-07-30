<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { IdAccount, APPLocalStorage } from "../../components/Stores.js";

  let FData = new FetchData();
  let AppLS = new APPLocalStorage();

  export let segment;
  let promise = Promise.resolve([]);
  let idaccount = 0;

  function ClickAddVehicle() {
    window.location.href = "/vehicle?idvehicle=0";
  }

  function ClickVehicleSelected(id) {
    console.log(id);
    let user = AppLS.getUser();
    user.preferences.idvehicle = id;
    AppLS.setUser(user);
    window.location.href = "/home";
  }

  function handleClickSearch(e) {
    promise = GetData(e.detail.text);
  }

  async function GetData(search) {
    let query = { idaccount: idaccount, search: search };
    const res = await FData.get("/api/vehicles", query, {
      "Content-Type": "application/json",
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }

  onMount(async () => {
    AppLS = new APPLocalStorage();
    idaccount = AppLS.getUser().idaccount;
  });
</script>

<style>
  .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }
</style>

<Menu {segment} ShowSearch="true" ShowR5="true" on:search={handleClickSearch}>
  <span slot="Title">
    <i class="fas fa-car fa-lg " />
    VEHICULOS
  </span>
  <span slot="R5" class="icon_link" on:click={ClickAddVehicle}>

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
    {#each datas as { name_vehicle, name, idcontact, flname, mark_label, license_plate, year, idvehicle }, i}
      <div
        class="column is-half-mobile is-one-third-tablet is-one-quarter-fullhd
        is-one-quarter-widescreen is-one-quarter-desktop">

        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{name_vehicle.toUpperCase()}</p>
            <span class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-car" />
              </span>
            </span>
          </header>
          <div class="card-content">

            <div class="columns is-multiline is-mobile">

              <div
                class="column is-half-tablet is-half-mobile is-half-fullhd
                is-half-widescreen is-half-desktop">
                <div class="field">
                  <label class="label is-small">Marca</label>
                  <div class="control is-small">
                    <input
                      type="text"
                      class="input is-small"
                      value={mark_label}
                      readonly />
                  </div>
                </div>
              </div>

              <div
                class="column is-half-tablet is-half-mobile is-half-fullhd
                is-half-widescreen is-half-desktop">
                <div class="field">
                  <label class="label is-small">Año</label>
                  <div class="control is-small">
                    <input
                      type="text"
                      class="input is-small"
                      value={year}
                      readonly />
                  </div>
                </div>
              </div>

            </div>
          </div>
          <footer class="card-footer">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="card-footer-item"
              on:click={ClickVehicleSelected(idvehicle)}>
              <span class="icon">
                <i class="fas fa-check" />
              </span>

            </a>
            <a href="/vehicle?idvehicle={idvehicle}" class="card-footer-item">
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
