<script>
  import { createEventDispatcher } from "svelte";
  export let enabled;
  export let ispublic;
  export let declare;
  export let code;
  export let note;
  const dispatch = createEventDispatcher();
  function HandleOnValue() {
    console.log("Ha cambiado...");
    dispatch("change", {});
  }
</script>

<style>

</style>

<div class="columns">
  <div class="column is-one-fifth">
    <label class="label is-small">Habilitado</label>
    <div class="control is-small">
      <input
        type="checkbox"
        class="is-small"
        bind:checked={enabled}
        readonly
        on:change={HandleOnValue} />
    </div>
  </div>
  <div class="column is-one-fifth">
    <label class="label is-small">Público</label>
    <div class="control is-small">
      <input
        type="checkbox"
        class="is-small"
        on:change={HandleOnValue}
        bind:checked={ispublic}
        readonly />
    </div>
  </div>
  <div class="column" />
</div>

<div class="columns">
  <div class="column">
    <label class="label">Declaración Variables</label>
    <div class="control">
      <textarea
        on:change={HandleOnValue}
        class="textarea is-small"
        placeholder=""
        rows="5"
        bind:value={declare} />
    </div>
  </div>
  <div class="column">
    <label class="label">Cuerpo Función</label>
    <div class="control">
      <textarea
        on:change={HandleOnValue}
        class="textarea is-small"
        placeholder=""
        rows="5"
        bind:value={code} />
    </div>
  </div>
</div>
<details>

  <summary>Notas</summary>
  <textarea
    class="textarea is-small"
    placeholder=""
    on:change={HandleOnValue}
    rows="2"
    bind:value={note} />
</details>
