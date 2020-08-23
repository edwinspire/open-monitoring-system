<script>
  import { FetchData } from "../FetchData.js";
  import MessageD from "../MessageDraggable.svelte";
  export let EndPoint;
  export let Show = false;
  let loading = false;

  let FData = new FetchData();

  $: {
    console.log({ Show });
  }

  async function SaveEndPoint() {
    console.log(EndPoint);
    loading = true;
    let dataEndpoint;
    try {
      if (EndPoint.idendpoint && EndPoint.idendpoint > 0) {
        // Modificar un endpoint
        const res = await FData.put("/pgapi/v2/endpoint", EndPoint, {
          "Content-Type": "application/json",
        });
        dataEndpoint = await res.json();
        console.log(dataEndpoint);
      } else {
        // Inserta un endpoint nuevo
        const res = await FData.post("/pgapi/v2/endpoint", EndPoint, {
          "Content-Type": "application/json",
        });
        dataEndpoint = await res.json();
        console.log(dataEndpoint);
      }
      loading = false;
      Show = false;
    } catch (error) {
      console.error(error);
      loading = false;
    }
  }
</script>

<style>

</style>

<MessageD bind:Show style=" ">
  <span slot="title">EndPoint</span>
  <div slot="body">
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">Endpoint</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input is-small"
              type="text"
              placeholder="endpoint"
              bind:value={EndPoint.endpoint} />
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">Habilitado</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input type="checkbox" bind:checked={EndPoint.enabled} />
          </p>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label is-small">Nota</label>
      <div class="control">
        <textarea
          class="textarea has-fixed-size"
          placeholder="Notes"
          bind:value={EndPoint.note} />
      </div>
    </div>

    <div class="field is-grouped is-grouped-right">
      <p class="control" on:click={SaveEndPoint}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="button is-primary is-small">Guardar</a>
      </p>
      <p
        class="control"
        on:click={() => {
          Show = false;
        }}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="button is-white is-small">Cancelar</a>
      </p>
    </div>
  </div>
</MessageD>
