<script>
  import moment from "moment";
  import Monitor from "./Monitor";
  import { FetchData } from "./FetchData.js";

  let DataTable = [];
  let FData = new FetchData();

  export let columns = {};
  export let url = "/notseturl";
  export let params = {};

  GetEvents();
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

  async function GetEvents() {
    try {
      const res = await FData.get(url, params, {
        "Content-Type": "application/json",
      });

      if (res.ok) {
        let data = await res.json();
        console.warn(data);
        if (Array.isArray(data)) {
          DataTable = data;
        } else if (data.originalError) {
          console.err(data);
        } else {
          console.warn(search.Index, item, data);
          //item.Articulos = JSON.stringify(data);
        }
      } else {
        console.error(res);
        //item.Articulos = "Error";
      }
    } catch (err) {
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
</style>

<div class="table-container table_font_size">
  Tabla Genérica
  <table
    class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">

    {#each DataTable as dataRow, i}
      {#if i == 0}
        <!-- Aqui escribe el encabezado de la tabla -->
        <thead>
          <tr>
            {#each Object.keys(dataRow) as item, ith}
              <!-- Muestra las columnas que no se hayan especificado como ocultas -->
              {#if columns[item]}
                {#if columns[item].hidden !== 'undefined' || !columns[item].hidden}
                  {#if columns[item].label}
                    <!-- Mostramos label si esque existe -->
                    <th>{columns[item].label}</th>
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
                {#if columns[item].type && columns[item].type == 'Date'}
                  <td on:click={ClickCell({ dataRow })}>
                    {moment(dataRow[item]).format('YYYY-MM-DD HH:mm:ss')}
                  </td>
                {:else}
                  <td on:click={ClickCell({ dataRow })}>{dataRow[item]}</td>
                {/if}
              {/if}
            {/if}
          {/each}
        </tr>
      </tbody>
    {/each}

  </table>
</div>
