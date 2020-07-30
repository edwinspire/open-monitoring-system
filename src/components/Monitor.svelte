<script>
  export let iddivision;
  //  export let name;
  //export let selected;
  import moment from 'moment';
  import Monitor from "./Monitor";
  import { FetchData } from "./FetchData.js";

  let DataEvents = [];
  let FData = new FetchData();
//  let promise = fetchData(iddivision);
GetEvents();
/*
  async function fetchData() {
    console.log(iddivision);
    const res = await FData.get(
      "/pgapi/events/view_open_events",
      { iddivision: iddivision },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }
  */

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

  async function handleClickSearch(e) {
    DataProcesada = DataProcesada.map((item) => {
      let it = item;
      if (it.S) {
        it.Articulos = "Consultando...";
      }
      return it;
    });

    DataProcesada.forEach((item, i) => {
      if (item.S) {
        let consultaTienda = GetDiffArt({
          Index: i,
          Oficina: item.Oficina,
          server: item.IP_Server,
          user: item.UsuarioBD,
          password: item.ClaveBD,
        });
      }
    });
  }

  function ClickCell(d) {
    console.log(d);
  }

  async function GetEvents() {
    try {
      const res = await FData.get(
        "/pgapi/events/view_open_events",
        { iddivision: iddivision },
        {
          "Content-Type": "application/json",
        }
      );

      if (res.ok) {
        let data = await res.json();
        console.warn(data);
        if (Array.isArray(data)) {
          DataEvents = data;
          //item.Articulos = data;
          //item.ListaArticulos = data;
        } else if (data.originalError) {
          //item.Articulos = JSON.stringify(data.originalError);
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
.table_font_size{
  font-size: small;
}
</style>

<!-- <Monitor url: "/pgapi/events/view_open_events" params: iddivision> -->
<div class="table-container table_font_size">
Esta es la tabla
  <table
    class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">

    {#each DataEvents as data, i}
      {#if i == 0}
        <thead>
          <tr>
            {#each Object.keys(data) as item, ith}
              <th>{item}</th>
            {/each}
          </tr>
        </thead>
      {/if}

      <tbody>
        <tr>
          {#each Object.values(data) as item, itd}
            {#if Array.isArray(item)}
              <td on:click={ClickCell({ data })}>{item.length}</td>
            {:else}
              <td on:click={ClickCell({ data })}>{item}</td>
            {/if}
          {/each}
        </tr>
      </tbody>
    {/each}

  </table>
</div>
