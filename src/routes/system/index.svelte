<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import NavSystem from "../../components/NavSystem.svelte";
  import Monitor from "../../components/Monitor.svelte";
  import Table from "../../components/Table/Table.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { UrlSearch } from "../../components/UrlSearch.js";
  import EndPoints from "../../components/Endpoints/EndPoints.svelte";
  import Divisions from "../../components/Divisions/Divisions.svelte";

  export let segment;

  let FData = new FetchData();
  let pageSelected = "system.events";
  let paramsMonitor = { iddivision: 0 };
  let ColumnsMonitor = {
    idevent: { label: "ID" },
    dateevent: { label: "Fecha", type: "Date" },
    account_name: { label: "Tienda" },
    label_status: { label: "Estado" },
    priority: { label: "P", type: "Priority" },
    label_eventtype: { label: "Evento" },
    description: { label: "Descripción" },
  };

  //console.log(ColumnsMonitor);
  function ChangePage(pageId) {
    pageSelected = pageId.detail.button;
    console.log(pageSelected);
  }

  onMount(async () => {
    //paramsMonitor.iddivision = UrlSearch("iddivision");
    //paramsdocumentos_por_consultar_estado.iddivision = paramsMonitor.iddivision;
    //console.log(paramsMonitor);
    //pageSelected = 1;
  });
</script>

<style>

</style>

<NavSystem {segment} on:button={ChangePage}>
  <span slot="title">
    <strong>OPEN MONITORING SYSTEM - CONFIG</strong>
  </span>
</NavSystem>

<div>

  {#if pageSelected === 'system.events'}
    <Table
      url="/pgapi/events/view_open_events"
      params={paramsMonitor}
      columns={ColumnsMonitor} />
  {:else if pageSelected === 'system.endpoints'}
    <EndPoints />
    {:else if pageSelected === 'system.divisions'}
    <Divisions />
  {:else}
    <p>is between 5 and 10</p>
  {/if}

</div>
