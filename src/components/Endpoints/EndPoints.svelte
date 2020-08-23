<script>
  import { onMount } from "svelte";
  import { FetchData } from "../FetchData.js";
  import Table from "../Table/Table";
  import SelectFromUrl from "../SelectFromUrl";
  import EndpointForm from "./EndpointForm";
  import MethodForm from "./MethodForm";

  let FData = new FetchData();

  /////////////////////////////////
  //// ENDPOINT ////
  /////////////////////////////////
  let ColumnsEndPoints = {
    endpoint: { label: "Endpoint" },
    enabled: { label: "Habilitado", type: "checkbox" },
    note: { label: "Notas" },
  };

  let showEnpointForm = false;
  let EndPointSelected = {};

  function HandleSelectEndpoint(ev) {
    EndPointSelected = ev.detail.data;
    paramsMethods.idendpoint = EndPointSelected.idendpoint;
    paramsMethods.endpoint = EndPointSelected.endpoint;
  }

  function HandleOnNewEndpoint(e) {
    EndPointSelected = {};
    EndPointSelected.idendpoint = -1;
    EndPointSelected.endpoint = "";
    EndPointSelected.enabled = true;
    EndPointSelected.note = "";
    showEnpointForm = true;
    console.log(EndPointSelected, showEnpointForm);
  }

  function HandleSelectEditEndpoint(ev) {
    console.log(ev.detail);
    EndPointSelected = ev.detail.data;
    showEnpointForm = true;
  }

  /////////////////////////////////
  //// METHOD ////
  /////////////////////////////////
  let ColumnsMethods = {
    method: { label: "Método" },
    enabled: { label: "Habilitado", type: "checkbox" },
    ispublic: { label: "Público", type: "checkbox" },
    declare: { label: "Variabled" },
    code: { label: "Código" },
    note: { label: "Notas" },
  };

  let paramsMethods = { idendpoint: -1 };
  let MethodSelected = {};
  let showMethodForm = false;

  function HandleOnNewMethod(e) {
    MethodSelected = {};
    MethodSelected.idendpoint = EndPointSelected.idendpoint;
    MethodSelected.endpoint = "";
    MethodSelected.enabled = true;
    MethodSelected.ispublic = false;
    MethodSelected.declare = "";
    MethodSelected.code = "";
    MethodSelected.note = "";
    showMethodForm = true;
  }

  function HandleSelectEditMethod(ev) {
    console.log(ev.detail);
    MethodSelected = ev.detail.data;
    showMethodForm = true;
  }

  function HandleSelectMethod(ev) {
    console.log(ev.detail);
    MethodSelected = ev.detail.data;
    //showMethodForm = true;
  }
</script>

<style>

</style>

<div class="container is-fullhd">

  <div class="columns">
    <div class="column">
      <Table
        on:clickrow={HandleSelectEndpoint}
        on:editrow={HandleSelectEditEndpoint}
        on:newrow={HandleOnNewEndpoint}
        url="/pgapi/v2/endpoints"
        columns={ColumnsEndPoints}>
        <span slot="title">
          <b>ENDPOINTS</b>
        </span>
      </Table>
    </div>
    <div class="column">

      {#if paramsMethods.idendpoint && paramsMethods.idendpoint > 0}
        <Table
          on:clickrow={HandleSelectMethod}
          on:editrow={HandleSelectEditMethod}
          on:newrow={HandleOnNewMethod}
          url="/pgapi/v2/methods"
          params={paramsMethods}
          columns={ColumnsMethods}>
          <span slot="title">
            <b>{paramsMethods.endpoint}</b>
          </span>
        </Table>
      {:else}
        <div>Seleccione un endpoint</div>
      {/if}

    </div>

  </div>

</div>

<EndpointForm bind:Show={showEnpointForm} bind:EndPoint={EndPointSelected} />
<MethodForm bind:Show={showMethodForm} bind:Method={MethodSelected} />