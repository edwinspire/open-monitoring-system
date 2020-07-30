<script>
  import SelectFromUrl from "../../components/SelectFromUrl.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import ToolBar from "../../components/ToolBar.svelte";

  import { IdAccount, APPLocalStorage } from "../../components/Stores.js";

  export let segment;
  let FData = new FetchData();
  let promise = Promise.resolve([]);
  let DataContact = {};

  function ClickAddContact() {
    console.log(DataContact);
    DataContact.idcontact = 0;
    DataContact.firstname = "";
    DataContact.lastname = "";
    DataContact.identification = "";
    DataContact.birthday = Date.now;
    DataContact.notes = "";
    DataContact.rowkey = 0;
  }

  async function Save() {
    if (
      DataContact.firstname.length > 0 &&
      DataContact.lastname.length > 0 &&
      DataContact.identification.length
    ) {
      console.log(DataContact);

      let resp = await FData.post("/api/contact_cu", DataContact, {
        "Content-Type": "application/json",
      });

      if (resp.ok) {
        let data = await resp.json();
        console.log(data);
        if (data.idcontact > 0 && data.rowkey > 0) {
          window.location.href = "/contacts";
        } else {
          alert("Algo salió mal");
        }
      } else {
        alert("Error");
      }
    } else {
      alert("No...");
    }
  }

  async function GetData() {
    if (DataContact.idaccount) {
        let searchParams = new URLSearchParams(
          new URL(window.location.href).search
        );

        DataContact.idcontact = searchParams.get("idcontact") || "-3";

      const res = await FData.get(
        "/api/contact_r",
        { idcontact: DataContact.idcontact, idaccount: DataContact.idaccount },
        { "Content-Type": "application/json" }
      );
      if (res.status == 200) {
        const data = await res.json();
        console.log(data);
        if (data.length > 0) {
          DataContact = data[0];
        }
      } else if (res.status == 401) {
        window.location.href = "/";
      }
    } else {
      console.log("No consulta", DataContact);
    }
  }

  onMount(async () => {
    let AppLS = new APPLocalStorage();
    DataContact.idaccount = AppLS.getUser().idaccount;
    GetData();
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

<Menu {segment} ShowR5="true" ShowR4="true">
  <span slot="Title">CONTACTO</span>
  <span slot="R4" class="icon_link" on:click={ClickAddContact}>
    <!-- svelte-ignore a11y-missing-attribute -->
    <a>
      <i class="fas fa-user fa-lg icon" />
      NUEVO
    </a>
  </span>
  <span slot="R5" class="icon_link" on:click={Save}>
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
          <label class="label is-small">Nombre</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              bind:value={DataContact.firstname} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Apellido</label>
          <div class="control is-small">
            <input
              placeholder="Placa"
              type="text"
              class="input is-small"
              bind:value={DataContact.lastname} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Identificación</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              bind:value={DataContact.identification} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Tipo Identificación</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/identificationtypes"
              bind:selected={DataContact.ididentificationtype} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Tipo Contacto</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/contacttypes"
              bind:selected={DataContact.idcontacttype} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Fecha Cumpleaños</label>
          <div class="control is-small">
            <input
              type="date"
              class="input is-small"
              bind:value={DataContact.birthday} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Género</label>
          <div class="control is-small">
            <SelectFromUrl
              url="/api/toselect/genders"
              bind:selected={DataContact.idgender} />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Notas</label>
          <div class="control is-small">

            <textarea class="input is-small" bind:value={DataContact.note} />
          </div>
        </div>
      </span>
    </div>

  </div>

</form>
