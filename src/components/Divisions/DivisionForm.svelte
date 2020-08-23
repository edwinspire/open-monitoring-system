<script>
  import { FetchData } from "../FetchData.js";
  import ModalMsg from "../ModalMessage.svelte";
  export let Division;
  export let Show = false;
  let loading = false;

  let FData = new FetchData();

  $: {
    console.log({ Show });
  }

  async function SaveDivision() {
    console.log(Division);
    loading = true;
    let dataToSend;
    try {
      if (Division.iddivision && Division.iddivision > 0) {
        // Modificar un Division
        const res = await FData.put("/pgapi/v2/division", Division, {
          "Content-Type": "application/json",
        });
        dataToSend = await res.json();
        console.log(dataToSend);
      } else {
        // Inserta un Division nuevo
        const res = await FData.post("/pgapi/v2/division", Division, {
          "Content-Type": "application/json",
        });
        dataToSend = await res.json();
        console.log(dataToSend);
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

{#if Division}
<ModalMsg bind:Show on:ok={SaveDivision}>
  <span slot="title">Division</span>
  <div slot="body">
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">Division</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
              class="input is-small"
              type="text"
              placeholder="Division"
              bind:value={Division.name} />
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
            <input type="checkbox" bind:checked={Division.enabled} />
          </p>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label is-small">Descripción</label>
      <div class="control">
        <textarea
          class="textarea has-fixed-size"
          placeholder="Notes"
          bind:value={Division.description} />
      </div>
    </div>
    <div class="field">
      <label class="label is-small">Nota</label>
      <div class="control">
        <textarea
          class="textarea has-fixed-size"
          placeholder="Notes"
          bind:value={Division.notes} />
      </div>
    </div>


  </div>
</ModalMsg>

{/if}