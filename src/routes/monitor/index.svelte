<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import Monitor from "../../components/Monitor.svelte";
  import Table from "../../components/Table.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { UrlSearch } from "../../components/UrlSearch.js";

  export let segment;

  let FData = new FetchData();
  let pageSelected = 0;
  let paramsMonitor = { iddivision: -1 };
  //idevent, ideventhex, iddivision, name_division, enabled_division,
  //idaccount, enabled_account, account_name, identification, account,
  //idaccountstate, account_state, dateevent, idstatustype, status_type, label_status,
  //priority, ideventtype, event_level, event_sound, event_color, label_eventtype, code,
  //enabled_eventtype, description, source, idequipment, equipment, idreceptionmode, label_mode, enabled_reception_mode, isopen, details, idadmin_assigned, ip, iddata
  let ColumnsMonitor = {
    idevent: { hidden: true, label: "ID" },
    dateevent: { hidden: true, label: "Fecha", type: "Date" },
    account_name: { label: "Cuenta" },
    label_status: { label: "Estado" },
    priority: { label: "Priodidad" },
    label_eventtype: { label: "Evento" },
    description: { label: "Descripción" },
  };
  console.log(ColumnsMonitor);
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
    console.log(paramsMonitor);
    pageSelected = 1;
  });
</script>

<style>
  /*  .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }*/
</style>

<Menu {segment}>
  <span slot="Title">
    <i class="fas fa-shield-alt" />
    OPEN MONITORING SYSTEM
  </span>

</Menu>

<div class="tabs is-small">
  <!-- svelte-ignore a11y-missing-attribute -->
  <ul>
    <li class:is-active={pageSelected === 1}>
      <a on:click={(e) => (pageSelected = 1)}>Eventos</a>
    </li>
    <li class:is-active={pageSelected === 2}>
      <a on:click={(e) => (pageSelected = 2)}>
        Movimientos de inventario sin cargar
      </a>
    </li>
    <li class:is-active={pageSelected === 3}>
      <a on:click={(e) => (pageSelected = 3)}>Documentos por enviar SRI</a>
    </li>
    <li class:is-active={pageSelected === 4}>
      <a on:click={(e) => (pageSelected = 4)}>Documentos por autorizar SRI</a>
    </li>
    <li class:is-active={pageSelected === 5}>
      <a on:click={(e) => (pageSelected = 5)}>Autorizaciones por enviar a CAR</a>
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
      url="/pgapi/events/view_open_events"
      params={paramsMonitor}
      columns={ColumnsMonitor} />
  {:else if pageSelected == 3}
    <section class="tab-content">No implementado</section>
  {:else if pageSelected == 4}
    <section class="tab-content">No implementado</section>
  {:else}
    <section class="tab-content">No implementado</section>
  {/if}

</div>
