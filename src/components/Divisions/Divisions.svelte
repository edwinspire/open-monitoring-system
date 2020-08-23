<script>
  import { onMount } from "svelte";
  import { FetchData } from "../FetchData.js";
  import Table from "../Table/Table";
  import SelectFromUrl from "../SelectFromUrl";
  import DivisionForm from "./DivisionForm";
  import AccountForm from "./AccountForm";

  let FData = new FetchData();

  /////////////////////////////////
  //// DIVISIONS ////
  /////////////////////////////////
  let ColumnsDivisions = {
    name: { label: "Nombre" },
    description: { label: "Descripción" },
    enabled: { label: "Habilitado", type: "checkbox" },
    notes: { label: "Notas" },
  };

  let showDivisionForm = false;
  let DivisionSelected = {};

  function HandleSelectDivision(ev) {
    DivisionSelected = ev.detail.data;
    paramsDivisions.iddivision = DivisionSelected.iddivision;
    paramsDivisions.name = DivisionSelected.name;
  }

  function HandleOnNewDivision(e) {
    DivisionSelected = {};
    DivisionSelected.iddivision = -1;
    DivisionSelected.name = "";
    DivisionSelected.enabled = true;
    DivisionSelected.note = "";
    showDivisionForm = true;
    console.log(DivisionSelected, showDivisionForm);
  }

  function HandleSelectEditDivision(ev) {
    console.log(ev.detail);
    DivisionSelected = ev.detail.data;
    showDivisionForm = true;
  }

  /////////////////////////////////
  //// ACCOUNTS ////
  /////////////////////////////////
  let ColumnsAccounts = {
    enabled: { label: "Habilitado", type: "checkbox" },
    account_name: { label: "Nombre" },
    identification: { label: "Identificación" },
    //    ididtype: { label: "Tipo" },
    identification_type: { label: "Tipo ID" },
    postal_code: { label: "Código Postal" },
    geox: { label: "Geox" },
    geoy: { label: "Geoy" },
    postal_code: { label: "Código Postal" },
    address: { label: "Dirección" },
    address_ref: { label: "Dir. Referencia" },
    //idaccountstate: { label: "Estado" },
    account_state: { label: "Estado" },
    //idaccounttype: { label: "Tipo Cuenta" },
    account_type: { label: "Tipo Cuenta" },
    start_date: { label: "Fecha Inicio" },
    end_date: { label: "Fecha Fin" },
    account: { label: "Cuenta" },
    isroot: { label: "Default", type: "checkbox" },
    note: { label: "Notas" },
  };

  let paramsDivisions = { iddivision: -1 };
  let AccountSelected = {};
  let showAccountForm = false;

  function HandleOnNewAccount(e) {
    AccountSelected = {};
    AccountSelected.iddivision = DivisionSelected.iddivision;
    AccountSelected.endpoint = "";
    AccountSelected.enabled = true;
    AccountSelected.ispublic = false;
    AccountSelected.declare = "";
    AccountSelected.code = "";
    AccountSelected.note = "";
    showAccountForm = true;
  }

  function HandleSelectEditAccount(ev) {
    console.log(ev.detail);
    AccountSelected = ev.detail.data;
    showAccountForm = true;
  }

  function HandleSelectAccount(ev) {
    console.log(ev.detail);
    AccountSelected = ev.detail.data;
    //showAccountForm = true;
  }
</script>

<style>

</style>

<div class="container is-fullhd">

  <div class="columns">
    <div class="column ">
      <Table
        on:clickrow={HandleSelectDivision}
        on:editrow={HandleSelectEditDivision}
        on:newrow={HandleOnNewDivision}
        url="/pgapi/v2/divisions"
        columns={ColumnsDivisions}>
        <span slot="title">
          <b>DIVISIONES</b>
        </span>
      </Table>
    </div>
    <div class="column is-half">

      {#if paramsDivisions.iddivision && paramsDivisions.iddivision > 0}
        <Table
          on:clickrow={HandleSelectAccount}
          on:editrow={HandleSelectEditAccount}
          on:newrow={HandleOnNewAccount}
          url="/pgapi/v2/accounts"
          params={paramsDivisions}
          columns={ColumnsAccounts}>
          <span slot="title">
            <b>{paramsDivisions.name}</b>
          </span>
        </Table>
      {:else}
        <div>Seleccione un endpoint</div>
      {/if}

    </div>

  </div>

</div>

<DivisionForm bind:Show={showDivisionForm} bind:Division={DivisionSelected} />
<AccountForm bind:Show={showAccountForm} bind:Account={AccountSelected} />
