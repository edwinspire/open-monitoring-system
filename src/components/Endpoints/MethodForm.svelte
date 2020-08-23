<script>
  import { FetchData } from "../FetchData.js";
  import MessageD from "../ModalMessage.svelte";
  export let Method;
  export let Show = false;
  let loading = false;

  let FData = new FetchData();

  $: {
    console.log({ Show });
  }

  async function SaveMethod() {
    console.log(Method);
    loading = true;
    let dataMethod;
    try {
      if (Method.idmethod && Method.idmethod > 0 && Method.idendpoint > 0) {
        // Modificar un Method
        const res = await FData.put("/pgapi/v2/method", Method, {
          "Content-Type": "application/json",
        });
        dataMethod = await res.json();
        console.log(dataMethod);
      } else {
        // Inserta un Method nuevo
        const res = await FData.post("/pgapi/v2/method", Method, {
          "Content-Type": "application/json",
        });
        dataMethod = await res.json();
        console.log(dataMethod);
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

{#if Method}

  <MessageD bind:Show on:ok={SaveMethod}>
    <span slot="title">Método</span>
    <div slot="body">
      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Método</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="text"
                placeholder="Method"
                bind:value={Method.method} />
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
              <input type="checkbox" bind:checked={Method.enabled} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Público</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input type="checkbox" bind:checked={Method.ispublic} />
            </p>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Variables</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="Notes"
            bind:value={Method.declare} />
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Código</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="Notes"
            bind:value={Method.code} />
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Nota</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="Notes"
            bind:value={Method.note} />
        </div>
      </div>

    </div>
  </MessageD>
{/if}
