<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import Monitor from "../../components/Monitor.svelte";
  import Table from "../../components/Table/Table.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { UrlSearch } from "../../components/UrlSearch.js";

  export let segment;

  let FData = new FetchData();
  //let pageSelected = 0;
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
    pageSelected = pageId;
    console.log(pageSelected);
  }

  function ClickVehicleSelected(id) {
    console.log(id);
    window.location.href = "/home";
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

<Menu {segment}>
  <span slot="Title">
    <i class="fas fa-shield-alt" />
    OPEN MONITORING SYSTEM
  </span>

</Menu>

<div class="columns">
  <div class="column">
    <Table
      url="/pgapi/events/view_open_events"
      params={paramsMonitor}
      columns={ColumnsMonitor}
      ShowItem4="true">
      <span slot="Item4">
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button
              class="button is-small"
              aria-haspopup="true"
              aria-controls="dropdown-menu">
              <span>Sistema</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true" />
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a href="endpoints" class="dropdown-item">
                <i class="fa fa-link" aria-hidden="true" />
                EndPoints
              </a>
            </div>
          </div>
        </div>
      </span>
    </Table>
  </div>
  <div class="column">Second column</div>
</div>
