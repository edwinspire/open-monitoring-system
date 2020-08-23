<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let Show = false;
</script>

<div class="modal" class:is-active={Show}>
  <div class="modal-background" />
  <div class="modal-card">
    <header class="modal-card-head has-background-dark">
      <p class="modal-card-title has-text-white">
        <b>
          <slot name="title" />
        </b>
      </p>
      <button
        class="delete"
        aria-label="close"
        on:click={(e) => {
          Show = false;
          dispatch('cancel', e);
        }} />
    </header>
    <section class="modal-card-body">
      <slot name="body" />
      
    </section>
    <footer class="modal-card-foot has-background-dark">
      <button
        class="button is-success is-small"
        on:click={(e) => {
          dispatch('ok', e);
        }}>
        <slot name="label-ok">Guardar</slot>
      </button>
      <button
        class="button is-small"
        on:click={(e) => {
          Show = false;
          dispatch('cancel', e);
        }}>
        <slot name="label-cancel">Cancelar</slot>
      </button>
    </footer>
  </div>
</div>
