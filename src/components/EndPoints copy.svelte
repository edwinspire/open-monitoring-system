<script>
  import { onMount } from "svelte";
  import { FetchData } from "../components/FetchData.js";
  import Table from "./Table";

  let FData = new FetchData();

  let MethodRow = {};
  let paramsMonitor = {};
  let ColumnsMonitor = {
    idendpoint: { label: "ID" },
    endpoint: { label: "EndPoint" },
    enabled: { label: "Habilitado" },
    note: { label: "Notas" },
  };

  async function HandlerClickRow(ev) {
    console.log(ev.detail);
    try {
      let datarow = ev.detail.data;
      MethodRow = { endpoint: datarow.endpoint };

      const res = await FData.get(
        "/pgapi/methods",
        { idendpoint: datarow.idendpoint },
        {
          "Content-Type": "application/json",
        }
      );

      if (res.status == 200) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 0) {
            MethodRow = data[0];
            MethodRow.endpoint = datarow.endpoint;
          }
        }
      } else {
        console.error(res.status);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
    //    console.log("Hola", Table);
  });
</script>

<style>

</style>

<div class="columns">
  <div class="column">
    <Table
      on:clickrow={HandlerClickRow}
      url="/pgapi/endpoints"
      params={paramsMonitor}
      columns={ColumnsMonitor}>
      <span slot="title">
        <b>ENDPOINTS</b>
      </span>
    </Table>
  </div>
  <div class="column">

{#if MethodRow.idendpoint && MethodRow.idendpoint > 0}
<nav class="level level_marginb">
  <!-- Left side -->
  <div class="level-left">
    <div class="level-item"><b>{MethodRow.endpoint}</b> </div>

  </div>

  <!-- Right side -->
  <div class="level-right">

    <div class="level-item">
      <i class="fas fa-save" />
    </div>
  </div>
</nav>
<article class="container is-fluid">
  <div class="columns is-multiline is-mobile">

    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Método</label>
          <div class="control is-small">
            <input
              placeholder="Placa"
              type="text"
              class="input is-small"
              value={MethodRow.method}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Habilitado</label>
          <div class="control is-small">
            <input
              type="checkbox"
              class="is-small"
              checked={MethodRow.enabled}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div
      class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
      is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Público</label>
          <div class="control is-small">
            <input
              type="checkbox"
              class="is-small"
              checked={MethodRow.ispublic}
              readonly />
          </div>
        </div>
      </span>
    </div>

  </div>

  <div class="field">
    <label class="label">Declaración de variables</label>
    <div class="control">
      <textarea class="textarea" placeholder="Textarea">
        {MethodRow.declare}
      </textarea>
    </div>
  </div>

  <div class="field">
    <label class="label">Cuerpo de la función</label>
    <div class="control">
      <textarea class="textarea" placeholder="Textarea">
        {MethodRow.code}
      </textarea>
    </div>
  </div>

  <div class="field">
    <label class="label">Notas</label>
    <div class="control">
      <textarea class="textarea" placeholder="Textarea">
        {MethodRow.note}
      </textarea>
    </div>
  </div>

</article>

{/if}
  </div>

</div>
