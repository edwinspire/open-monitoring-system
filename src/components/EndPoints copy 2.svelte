<script>
  import { onMount } from "svelte";
  import { FetchData } from "../components/FetchData.js";
  import CMethod from "./Method";
  import Table from "./Table/Table";
  import SelectFromUrl from "./SelectFromUrl";

  let FData = new FetchData();

  let Methods = [];
  let EndPoint = {};
  let new_endpoint_value;

  function HandleOnChangeMethod() {
    console.log(Methods);
  }

  async function AddEndPoint() {
    console.log("Llega aqui", new_endpoint_value);
    try {
      if (new_endpoint_value && new_endpoint_value.length > 0) {
        const res = await FData.put(
          "/pgapi/v2/endpoint",
          { endpoint: new_endpoint_value },
          {
            "Content-Type": "application/json",
          }
        );
        console.log(res);
        if (res.status == 200) {
          const data = await res.json();
          if (Array.isArray(data)) {
            if (data.length > 0) {
              EndPoint = data[0];
              //            paramsMethods.idendpoint = EndPoint.idendpoint;
              console.log(EndPoint);
              //GetMethods();
            }
          }
        } else {
          console.error(res.status);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function HandleSelectEndpoint(ev) {
    console.log(ev.detail);
    try {
      EndPoint = {};
      //    paramsMethods.idendpoint = -2;
      let dataEndPoint = ev.detail;

      const res = await FData.get(
        "/pgapi/endpoints",
        { idendpoint: dataEndPoint.value },
        {
          "Content-Type": "application/json",
        }
      );

      if (res.status == 200) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 0) {
            EndPoint = data[0];
            //            paramsMethods.idendpoint = EndPoint.idendpoint;
            console.log(EndPoint);
            GetMethods();
          }
        }
      } else {
        console.error(res.status);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function GetMethods() {
    try {
      const res = await FData.get(
        "/pgapi/methods",
        { idendpoint: EndPoint.idendpoint },
        {
          "Content-Type": "application/json",
        }
      );

      if (res.status == 200) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 0) {
            Methods = data;
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
  .padding_add_endpoint {
    padding: 10px;
  }
</style>

<div class="container is-fullhd">
  <nav class="level">
    <!-- Left side -->
    <div class="level-left">
      <div class="level-item">
        <b>ENDPOINT</b>
      </div>
      <div class="level-item">
        <SelectFromUrl
          url="/pgapi/api/endpoints_to_select"
          on:value={HandleSelectEndpoint} />
      </div>
    </div>

    <!-- Right side -->
    <div class="level-right">

      <div class="level-item">
        <div class="dropdown is-hoverable is-right">
          <div class="dropdown-trigger">
            <button
              class="button is-small"
              aria-haspopup="true"
              aria-controls="dropdown-menu2">
              <span>Agregar</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true" />
              </span>
            </button>
          </div>
          <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <div class="field has-addons padding_add_endpoint">
                <div class="control">
                  <input
                    bind:value={new_endpoint_value}
                    class="input is-small"
                    type="text"
                    placeholder="endpoint" />
                </div>
                <div class="control">
                  <span class="button is-info is-small" on:click={AddEndPoint}>
                    Guardar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <details>

    <summary>Detalle {EndPoint.endpoint}</summary>

    <article class="container is-fluid">
      <div class="columns is-multiline is-mobile">
        <div
          class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
          is-one-quarter-widescreen is-one-quarter-desktop">
          <span>
            <div class="">
              <label class="label is-small">EndPoint</label>
              <div class="control is-small">
                <input
                  placeholder="EndPoint"
                  type="text"
                  class="input is-small"
                  bind:value={EndPoint.endpoint}
                  readonly />
              </div>
            </div>
          </span>
        </div>

        <div
          class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
          is-one-quarter-widescreen is-one-quarter-desktop">
          <span>
            <div class="">
              <label class="label is-small">Notas</label>
              <div class="control is-small">
                <input
                  placeholder="Notas - Observaciones"
                  type="text"
                  class="input is-small"
                  bind:value={EndPoint.note}
                  readonly />
              </div>
            </div>
          </span>
        </div>

        <div
          class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
          is-one-quarter-widescreen is-one-quarter-desktop">
          <span>
            <div class="">
              <label class="label is-small">Habilitado</label>
              <div class="control is-small">
                <input
                  type="checkbox"
                  class="is-small"
                  bind:checked={EndPoint.enabled}
                  readonly />
              </div>
            </div>
          </span>
        </div>

      </div>

    </article>

  </details>

  {#if EndPoint.idendpoint > 0}
    <div class="container is-fluid">
      {#each Methods as Item}
        <details>

          <summary>
            <span class="icon is-small">
              <input type="checkbox" checked={Item.enabled} disabled />
            </span>
            <span>{Item.method}</span>

          </summary>
          <CMethod
            on:change={HandleOnChangeMethod}
            bind:enabled={Item.enabled}
            bind:ispublic={Item.ispublic}
            bind:declare={Item.declare}
            bind:code={Item.code}
            bind:note={Item.note} />
        </details>
      {/each}
    </div>
  {/if}
</div>
