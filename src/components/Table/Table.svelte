<script>
  import { createEventDispatcher } from "svelte";
  import { onDestroy } from "svelte";
  import TableCell from "./TableCell";
  import { FetchData } from ".././FetchData.js";
  //  import  SortColumn from "./Sort.js";

  const dispatch = createEventDispatcher();
  let DataTable = [];
  let RawDataTable = [];
  let FData = new FetchData();
  let text_search;
  let loading = true;
  let showEdit = false;
  let showSelection = false;
  let SelectAll = false;
  export let columns = {};
  export let url = "/notseturl";
  export let ShowItem0 = false;
  export let ShowItem1 = false;
  export let ShowItem2 = false;
  export let ShowItem3 = false;
  export let ShowItem4 = false;
  export let params = {};
  let orderASC = true;

  $: {
    console.log({ params });
    GetDataTable();
  }

  let auto_refresh = setInterval(() => {
    GetDataTable();
  }, 15 * 1000);

  onDestroy(() => {
    console.log("Mata refresh");
    clearInterval(auto_refresh);
  });

  function SortColumn(key, order = "asc") {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order === "desc" ? comparison * -1 : comparison;
    };
  }

  function HClickCell(cell, row) {
    dispatch("clickrow", { field: cell, data: row });
  }

  function HClickEditRow(e) {
    console.log(e);
    dispatch("editrow", { data: e });
  }
  function HClickNew(e) {
    dispatch("newrow", e);
  }
  function HClickHeader(e) {
    if (orderASC) {
      DataTable = DataTable.sort(SortColumn(e.target.dataset.column));
    } else {
      DataTable = DataTable.sort(SortColumn(e.target.dataset.column, "desc"));
    }
    orderASC = !orderASC;
  }

  function handleClickSearch() {
    if (text_search && text_search.length > 0) {
      FilterData();
    } else {
      GetDataTable();
    }
  }

  GetDataTable();

  async function handleChangeSelectAll(e) {
    console.log(e);
    SelectAll = e.target.checked;

    DataTable = DataTable.map((item) => {
      let it = item;
      it["OMS-Table-RowSelected"] = SelectAll;
      return it;
    });
  }

  async function handleExportSelection(e) {
    var fName = "Data.csv";
    let DataExport = DataTable.filter((item) => {
      return item["OMS-Table-RowSelected"];
    });

    let LinesCSV = "";

    console.log(DataExport);
    let header = Object.keys(DataExport[0]).map((item) => {
      if (columns[item] && columns[item].label) {
        return '"' + columns[item].label + '"';
      } else if (item == "OMS-Table-RowSelected") {
        return '"Selected"';
      }
      return '"' + item + '"';
    });

    LinesCSV = header.join(",") + "\r\n";

    DataExport.forEach((item) => {
      let row = Object.values(item).map((it) => {
        return '"' + it + '"';
      });
      LinesCSV = LinesCSV + row.join(",") + "\r\n";
    });
    //console.log(LinesCSV);

    // for UTF-16
    var cCode,
      bArr = [];
    bArr.push(255, 254);
    for (var i = 0; i < LinesCSV.length; ++i) {
      cCode = LinesCSV.charCodeAt(i);
      bArr.push(cCode & 0xff);
      bArr.push((cCode / 256) >>> 0);
    }

    var blob = new Blob([new Uint8Array(bArr)], {
      type: "text/csv;charset=UTF-16LE;",
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fName);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        var url = window.URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }
  }

  /*
  async function handleChangeSelectItem(e, data) {
    let sel = e.checked;

    DataTable = DataTable.map((item) => {
      let it = item;
      if (item.IP_Server == data.data.IP_Server) {
        it.S = sel;
      }

      return it;
    });
  }
*/
  function FilterData() {
    console.log("Filtrar", text_search);
    if (text_search && text_search.length > 0) {
      DataTable = RawDataTable.filter((d) => {
        let s = Object.values(d).filter((item) => {
          if (item) {
            return item
              .toString()
              .toUpperCase()
              .includes(text_search.toUpperCase());
          } else {
            return item;
          }
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

  function HandleOnClickEdit() {
    console.log(showEdit);
    showEdit = !showEdit;
    return false;
  }

  function HandleOnClickSelection() {
    console.log(showSelection);
    showSelection = !showSelection;
    return false;
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
          DataTable = [];
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
  }
</script>

<style>
  .size_search {
    width: 7em;
  }
  .show_cursor_mouse {
    cursor: pointer;
  }
</style>

<!-- Main container -->
<nav class="level">
  <!-- Left side -->
  <div class="level-left">
    <slot class="level-item" name="title">.</slot>
  </div>

  <!-- Right side -->
  <div class="level-right">
    {#if ShowItem0}
      <div class="level-item">
        <slot name="Item0" />
      </div>
    {/if}
    {#if ShowItem1}
      <div class="level-item">
        <slot name="Item1" />
      </div>
    {/if}
    {#if ShowItem2}
      <div class="level-item">
        <slot name="Item2" />
      </div>
    {/if}
    {#if ShowItem3}
      <div class="level-item">
        <slot name="Item3" />
      </div>
    {/if}
    {#if ShowItem4}
      <div class="level-item">
        <slot name="Item4" />
      </div>
    {/if}
    {#if loading}
      <div class="level-item">
        <span class="icon has-text-info">
          <i class="fas fa-spinner fa-pulse" />
        </span>
      </div>
    {/if}

    <div class="level-item">
      <div class="dropdown is-hoverable is-right">
        <div class="dropdown-trigger">
          <button
            class="button is-small"
            aria-haspopup="true"
            aria-controls="dropdown-menu">
            <span class="icon">
              <i class="fa fa-list" aria-hidden="true" />
            </span>
            <span>Opciones</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div class="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="dropdown-item is-size-7" on:click={HClickNew}>
              <span class="icon">
                <i class="fas fa-file" />
              </span>
              <span>Agregar</span>
            </a>
            <hr class="dropdown-divider" />

            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="dropdown-item is-size-7"
              class:is-active={showSelection}
              on:click={HandleOnClickSelection}>
              <span class="icon">
                <i class="fas fa-tasks" />
              </span>
              <span>Selección</span>
            </a>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="dropdown-item is-size-7"
              class:is-active={showEdit}
              on:click={HandleOnClickEdit}>
              <span class="icon">
                <i class="fas fa-pen" />
              </span>
              <span>Editar</span>
            </a>
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="dropdown-item is-size-7" on:click={handleExportSelection}>
              <span class="icon">
                <i class="fas fa-download" />
              </span>
              <span>Exportar</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="level-item">
      <div class="field has-addons">
        <p class="control">
          <button class="button is-small" on:click={HClickNew}>
            <span class="icon is-small">
              <i class="fas fa-file" />
            </span>
            <span>Agregar</span>
          </button>
        </p>
        <p class="control">
          <button class="button is-small">
            <span class="icon is-small">
              <i class="fas fa-tasks" />
            </span>
            <span>Selección</span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small"
            class:is-danger={showEdit}
            on:click={HandleOnClickEdit}>
            <span class="icon is-small">
              <i class="fas fa-pen" />
            </span>
            <span>Editar</span>
          </button>
        </p>
      </div>
    </div> -->

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
<div class="table-container is-size-7">
  {#if DataTable.length > 0}
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
      <!-- Aqui escribe el encabezado de la tabla -->
      <thead>
        <tr class="gbackground-silver">
          <th class="has-text-centered">#</th>

          {#if showSelection}
            <th class="has-text-centered">
              <input type="checkbox" on:click={handleChangeSelectAll} />
            </th>
          {/if}

          {#if showEdit}
            <th class="has-text-centered">
              <i class="fas fa-pen" />
            </th>
          {/if}

          {#each Object.keys(DataTable[0]) as item, ith}
            <!-- Muestra las columnas que no se hayan especificado como ocultas -->
            {#if columns[item]}
              {#if columns[item].hidden !== 'undefined' || !columns[item].hidden}
                {#if columns[item].label}
                  <!-- Mostramos label si esque existe -->
                  <th
                    class="has-text-centered show_cursor_mouse"
                    data-column={item}
                    on:click={HClickHeader}>
                    {columns[item].label}
                  </th>
                {:else}
                  <th>{item}</th>
                {/if}
              {/if}
            {/if}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each DataTable as dataRow, i}
          <tr>
            <td>{i + 1}</td>
            {#if showSelection}
              <td class="has-text-centered show_cursor_mouse">
                <input
                  type="checkbox"
                  checked={dataRow['OMS-Table-RowSelected']}
                  on:click={(e) => {
                    dataRow['OMS-Table-RowSelected'] = e.target.checked;
                  }} />
              </td>
            {/if}

            {#if showEdit}
              <td
                class="has-text-centered show_cursor_mouse"
                on:click={HClickEditRow(dataRow)}>
                <span class="icon is-small">
                  <i class="fas fa-pen" />
                </span>
              </td>
            {/if}
            {#each Object.keys(dataRow) as item, itd}
              <!-- Muestra las columnas que no se hayan especificado como ocultas -->
              {#if columns[item]}
                {#if columns[item].hidden !== 'undefined' || !columns[item].hidden}
                  <TableCell
                    on:clickcell={HClickCell(item, dataRow)}
                    value={dataRow[item]}
                    type={columns[item].type} />
                {/if}
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="has-text-centered has-text-link-dark">
      <i class="fa fa-table" aria-hidden="true" />
      No hay datos que mostrar
    </div>
  {/if}
</div>
