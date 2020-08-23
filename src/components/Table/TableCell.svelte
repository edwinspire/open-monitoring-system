<script>
  import { createEventDispatcher } from "svelte";
  import moment from "moment";
  import TableCellPriority from "./TableCellPriority.svelte";

  export let type;
  export let value;

  const dispatch = createEventDispatcher();

  function ClickCell(d) {
    dispatch("clickcell", {
      value: value,
    });
  }
</script>

<style>

</style>

{#if type}
  {#if type === 'Date'}
    <td on:click={ClickCell}>
      {moment(Date.parse(value)).format('YYYY-MM-DD HH:mm:ss')}
    </td>
  {:else if type === 'Priority'}
    <TableCellPriority on:click={ClickCell} {value} />
  {:else if type === 'Boolean-Color'}
    {#if !value}
      <td
        on:click={ClickCell}
        class="has-background-danger has-text-white has-text-centered">
        <i class="fa fa-times" aria-hidden="true" />
      </td>
    {:else}
      <td
        on:click={ClickCell}
        class="has-background-success has-text-white has-text-centered">
        <i class="fa fa-check" aria-hidden="true" />
      </td>
    {/if}
  {:else}
    <td on:click={ClickCell}>{value}</td>
  {/if}
{:else}
  <td on:click={ClickCell}>{value}</td>
{/if}
