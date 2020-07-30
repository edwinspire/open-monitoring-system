<script>
  import { get_binding_group_value } from "svelte/internal";
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import ToolBar from "../../components/ToolBar.svelte";
  import SelectFromUrl from "../../components/SelectFromUrl.svelte";
  import { IdAccount, APPLocalStorage } from "../../components/Stores.js";
  import { FetchData } from "../../components/FetchData.js";

  export let segment;

  let FData = new FetchData();
  let vehicle = { name: "" };
  let promise = GetData();

  function ClickAddVehicle() {
    console.log(vehicle);
    let idaccount = vehicle.idaccount;
    vehicle = {};
    vehicle.idvehicle = 0;
    vehicle.idaccount = idaccount;
  }

  async function Save() {
    if (Number(vehicle.idcontact) > 0) {
      if (vehicle.license_plate && vehicle.license_plate.length > 0) {
        console.log(vehicle);

        let resp = await FData.post("/api/vehicle_cu", vehicle, {
          "Content-Type": "application/json",
        });

        if (resp.status == 200) {
          vehicle = await resp.json();

          console.log(vehicle);
          if (vehicle.idvehicle > 0) {
            window.location.href = "/vehicles";
          } else {
            alert("No se pudo guardar");
          }
        } else if (resp.status == 401) {
          window.location.href = "/";
        } else {
          alert("No se pudo guardar " + resp.status);
        }
      } else {
        alert("Complete los campos que son requeridos");
      }
    } else {
      alert("Debe seleccionar un Propietario");
    }
  }

  async function GetData() {
    let AppLS = new APPLocalStorage();
    vehicle.idaccount = AppLS.getUser().idaccount;
    let searchParams = new URLSearchParams(
      new URL(window.location.href).search
    );
    let idvehicle = searchParams.get("idvehicle") || "-2";

    /*
    let urlOrg = new URL(window.location.href);
    let searchParams = new URLSearchParams(urlOrg.search);
    let idvehicle = searchParams.get("idvehicle") || "-2";
    let url =
      "/api/vehicle?idvehicle=" + idvehicle + "&idaccount=" + vehicle.idaccount;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
*/

    const res = await FData.get(
      "/api/vehicle",
      { idvehicle: idvehicle, idaccount: vehicle.idaccount },
      {
        "Content-Type": "application/json",
      }
    );

    console.log(res);

    if (res.ok) {
      let data = await res.json();
      console.log(res);
      if (data.length > 0 && data[0].idaccount && data[0].idvehicle) {
        vehicle = data[0];
        return true;
      } else {
        //        throw new Error("No devolvio datos");
        console.log("No devolvió datos");
        return false;
      }
    } else {
      console.log("No se pudo cargar la información");
      return false;
    }
  }
</script>

<style>
 .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }
</style>

<Menu {segment}  ShowR5=true ShowR4=true>

  <span slot="Title"> <i class="fas fa-car fa-lg icon" /> VEHICULO</span>
  <span slot="R4" class="icon_link" on:click={ClickAddVehicle}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click={ClickAddVehicle}>
      <i class="fas fa-car fa-lg icon" />
      NUEVO
    </a>
  </span>
  <span slot="R5" on:click={Save} class="icon_link">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a>
      <i class="fas fa-save fa-lg icon" />
      GUARDAR
    </a>
  </span>
</Menu>



<form class="container is-fluid">

  <div class="columns is-multiline is-mobile">
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Propietario</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/contacts"
              query={{ idaccount: vehicle.idaccount }}
              bind:selected={vehicle.idcontact} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Placa</label>
          <div class="control is-small">
            <input
              placeholder="Placa"
              type="text"
              required={true}
              class="input is-small"
              bind:value={vehicle.license_plate} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Auto</label>
          <div class="control is-small">
            <input
              placeholder="Auto"
              type="text"
              class="input is-small"
              bind:value={vehicle.name} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Marca</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/marks"
              bind:selected={vehicle.idmark} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Año</label>
          <div class="control is-small">
            <input
              type="number"
              class="input is-small"
              bind:value={vehicle.year} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">VIN</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              bind:value={vehicle.vin} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Color</label>
          <div class="control is-small">
            <input
              type="color"
              class="input is-small"
              bind:value={vehicle.color} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Tipo de combustible</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/fueltypes"
              bind:selected={vehicle.idfueltype} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Capacidad del tanque</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              bind:value={vehicle.fuel_tank_capacity} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Unidad de medida del tanque</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/unit_measure_fuel_tanks"
              bind:selected={vehicle.idunit_measure_fuel_tank} />
          </div>
        </div>
      </span>
    </div>
  </div>

</form>
