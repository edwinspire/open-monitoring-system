<script>
  import { onMount } from "svelte";
  import NavSystem from "../../components/NavSystem.svelte";
  import Monitor from "../../components/Monitor.svelte";
  import Table from "../../components/Table/Table.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { UrlSearch } from "../../components/UrlSearch.js";

  export let segment;

  let FData = new FetchData();
  let pageSelected = 0;
  let paramsMonitor = { iddivision: -1 };
  let ColumnsMonitor = {
    idevent: {  label: "ID" },
    dateevent: {  label: "Fecha", type: "Date" },
    account_name: { label: "Tienda" },
    label_status: { label: "Estado" },
    priority: { label: "P", type: "Priority" },
    label_eventtype: { label: "Evento" },
    description: { label: "Descripción" },
  };

  let paramsdocumentos_por_consultar_estado = { iddivision: -1 };
  let Columnsdocumentos_por_consultar_estado = {
    fecha_emision: {  label: "Emisiónx", type: "Date" },
    account_name: { label: "Tienda" },
    serie_documento: { label: "Documento" },
    identification: { label: "Cod. SAP" },
    tipo_documento: { label: "Tipo" },
    matriz: { label: "Matriz", type: "Boolean-Color" },
    enviado: { label: "Enviado", type: "Boolean-Color" },
    autorizado: { label: "Autorizado", type: "Boolean-Color" },
    car: { label: "Car", type: "Boolean-Color" },
  };

  //account_name, account, identification, en_pv, en_matriz, enviados , autorizados, en_car
  let ColumsDocsResumenHoy = {
    account_name: { label: "Tienda" },
    identification: { label: "Cod. SAP" },
    en_pv: { label: "PV" },
    en_matriz: { label: "Matriz" },
    enviados: { label: "Enviados" },
    autorizados: { label: "Autorizados" },
    en_car: { label: "Car" },
  };

  let COLUMNS_movinv_pendientes_cargar = {
    account_name: { label: "Tienda" },
    //account: { hidden: true },
    bukrs: { label: "bukrs" },
    bwart: { label: "bwart" },
    //cpudt: { hidden: true },
    //cputm: { hidden: true },
    shkzg: { label: "shkzg" },
    matnr: { label: "matnr" },
    mblnr: { label: "mblnr" },
    menge: { label: "menge" },
    werks: { label: "werks" },
    datetimefile: { label: "Fecha", type: "Date" }
  };

  //console.log(ColumnsMonitor);
  function ChangePage(pageId) {
    pageSelected = pageId;
    console.log(pageSelected);
  }

  function ClickVehicleSelected(id) {
    console.log(id);
    window.location.href = "/home";
  }

  onMount(async () => {
    paramsMonitor.iddivision = UrlSearch("iddivision");
    paramsdocumentos_por_consultar_estado.iddivision = paramsMonitor.iddivision;
    //console.log(paramsMonitor);
    pageSelected = 1;
  });
</script>

<style>
  .tab_margin {
    margin-bottom: 0.5em;
  }
  /*  .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }*/
</style>

<NavSystem {segment} >
  <span slot="title">
    <strong>OPEN MONITORING SYSTEM</strong>
  </span>
</NavSystem>

<div class="tabs is-small tab_margin">
  <!-- svelte-ignore a11y-missing-attribute -->
  <ul>
    <li class:is-active={pageSelected === 1}>
      <a on:click={(e) => (pageSelected = 1)}>Eventos</a>
    </li>
    <li class:is-active={pageSelected === 2}>
      <a on:click={(e) => (pageSelected = 2)}>
        Fact. Electrónica - Resumen Hoy
      </a>
    </li>
    <li class:is-active={pageSelected === 3}>
      <a on:click={(e) => (pageSelected = 3)}>
        Fact. Electrónica - Documentos Pendientes
      </a>
    </li>
    <li class:is-active={pageSelected === 4}>
      <a on:click={(e) => (pageSelected = 4)}>Mov. Inv. Pendientes</a>
    </li>
    <li class:is-active={pageSelected === 5}>
      <a on:click={(e) => (pageSelected = 5)}>-</a>
    </li>
  </ul>
</div>

<div>

  {#if pageSelected == 1}
    <Table
      url="/pgapi/events/view_open_events"
      params={paramsMonitor}
      columns={ColumnsMonitor} />
  {:else if pageSelected == 2}
    <Table
      url="/pgapi/external_data/documentos_xml_resumen_hoy"
      params={paramsdocumentos_por_consultar_estado}
      columns={ColumsDocsResumenHoy} />
  {:else if pageSelected == 3}
    <Table
      url="/pgapi/etarm/documentos_por_consultar_estado"
      params={paramsdocumentos_por_consultar_estado}
      columns={Columnsdocumentos_por_consultar_estado} />
  {:else if pageSelected == 4}
    <section class="tab-content">
      <Table
        url="/pgapi/etarm/movinv_pendientes_cargar"
        params={paramsdocumentos_por_consultar_estado}
        columns={COLUMNS_movinv_pendientes_cargar} />
    </section>
  {:else}
    <section class="tab-content">No implementado</section>
  {/if}

</div>
