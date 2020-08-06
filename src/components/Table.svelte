<script>
  import { onDestroy } from 'svelte';
  import Monitor from "./Monitor";
  import TableCell from "./TableCell";
  import { FetchData } from "./FetchData.js";

  let DataTable = [];
  let RawDataTable = [];
  let FData = new FetchData();
  let text_search;
  let loading = true;

  export let columns = {};
  export let url = "/notseturl";
  export let params = {};

  let auto_refresh = setInterval(() => {
    GetDataTable();
  }, 15 * 1000);


  onDestroy(() => {
    console.log('Mata refresh');
		clearInterval(auto_refresh);
	});

  function handleClickSearch() {
    if (text_search && text_search.length > 0) {
      FilterData();
    } else {
      GetDataTable();
    }
    // dispatch("search", {
    //   text: text_search,
    // });
  }

  GetDataTable();

  async function handleChangeSelectAll(e) {
    SelectAll = e.target.checked;

    DataProcesada = DataProcesada.map((item) => {
      let it = item;
      it.S = SelectAll;
      return it;
    });
  }

  async function handleChangeSelectItem(e, data) {
    let sel = e.checked;

    DataProcesada = DataProcesada.map((item) => {
      let it = item;
      if (item.IP_Server == data.data.IP_Server) {
        it.S = sel;
      }

      return it;
    });
  }

  function ClickCell(d) {
    console.log(d);
  }

  function FilterData() {
    console.log('Filtrar', text_search);
    if (text_search && text_search.length > 0) {
      DataTable = RawDataTable.filter((d) => {
        let s = Object.values(d).filter((item) => {
          return item
            .toString()
            .toUpperCase()
            .includes(text_search.toUpperCase());
        });

        if (s.length > 0) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      DataTable = RawDataTable;
    }
  }

  async function GetDataTable() {
    try {
      loading = true;
      const res = await FData.get(url, params, {
        "Content-Type": "application/json",
      });

      if (res.ok) {
        let data = await res.json();
        //console.warn(data);
        if (Array.isArray(data)) {
          RawDataTable = data;
          FilterData();
        } else {
          console.warn(data);
          //item.Articulos = JSON.stringify(data);
        }
      } else {
        console.error(res);
        //item.Articulos = "Error";
      }
      loading = false;
    } catch (err) {
      loading = false;
      //item.Articulos = JSON.stringify(err);
      console.warn(err);
    }
    /*
    DataProcesada = DataProcesada.map((row) => {
      let r = row;
      if (item.IP_Server === row.IP_Server) {
        r = item;
      }
      return r;
    });
    */
  }
</script>

<style>
  .table_font_size {
    font-size: small;
  }
  .level_marginb {
    margin-bottom: 0.3em;
  }
</style>

<!-- Main container -->
<nav class="level level_marginb">
  <!-- Left side -->
  <div class="level-left">
    <div class="level-item">.</div>

  </div>

  <!-- Right side -->
  <div class="level-right">

{#if loading}
<div class="level-item">
  <span class="icon has-text-info">
    <i class="fas fa-spinner fa-pulse"></i>
  </span>
</div>
{/if}

    <div class="level-item">
      <div class="field has-addons">
        <p class="control">
          <input
            class="input size_search is-small"
            type="text"
            placeholder="Buscar"
            bind:value={text_search} />
        </p>
        <p class="control">
          <button class="button is-small" on:click={handleClickSearch}>
            <i class="fas fa-search" />
          </button>
        </p>
      </div>
    </div>
  </div>
</nav>
<div class="table-container table_font_size">
{#if DataTable.length > 0}
<table
class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">

{#each DataTable as dataRow, i}
  {#if i == 0}
    <!-- Aqui escribe el encabezado de la tabla -->
    <thead>
      <tr class="has-background-grey-darker">
        {#each Object.keys(dataRow) as item, ith}
          <!-- Muestra las columnas que no se hayan especificado como ocultas -->
          {#if columns[item]}
            {#if columns[item].hidden !== 'undefined' || !columns[item].hidden}
              {#if columns[item].label}
                <!-- Mostramos label si esque existe -->
                <th class="has-text-light has-text-centered">{columns[item].label}</th>
              {:else}
                <th>{item}</th>
              {/if}
            {/if}
          {/if}
        {/each}
      </tr>
    </thead>
  {/if}

  <tbody>
    <tr>
      {#each Object.keys(dataRow) as item, itd}
        <!-- Muestra las columnas que no se hayan especificado como ocultas -->
        {#if columns[item]}
          {#if columns[item].hidden !== 'undefined' || !columns[item].hidden}
            <TableCell
              value={dataRow[item]}
              type={columns[item].type}
              row={dataRow} />
          {/if}
        {/if}
      {/each}
    </tr>
  </tbody>
{/each}

</table>
{:else}
<div class="has-text-centered has-text-link-dark"><i class="fa fa-table" aria-hidden="true"></i> No hay datos que mostrar</div>
{/if}
</div>
