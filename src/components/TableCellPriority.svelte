<script>
  import moment from "moment";

  export let value;
  export let row = {};

  function ClickCell(d) {
    console.log(row);
  }
</script>

<style>
  .priority1 {
    background-color: rgb(252, 56, 66);
  }
  .priority2 {
    background-color: rgb(255, 123, 0);
  }
  .priority3 {
    background-color: rgb(255, 208, 0);
  }
  .priority4 {
    background-color: rgb(255, 251, 0);
  }
  .priority5 {
    background-color: rgb(208, 255, 0);
  }
  .priority6 {
    background-color: rgb(51, 255, 0);
  }
</style>

{#if value == 1}
  <td on:click={ClickCell} class="priority1 has-text-centered">{value}</td>
{:else if value == 2}
  <td on:click={ClickCell} class="priority2 has-text-centered">{value}</td>
{:else if value == 3}
  <td on:click={ClickCell} class="priority3 has-text-centered">{value}</td>
{:else if value == 4}
  <td on:click={ClickCell} class="priority4 has-text-centered">{value}</td>
{:else if value == 5}
  <td on:click={ClickCell} class="priority5 has-text-centered">{value}</td>
{:else if value == 6}
  <td on:click={ClickCell} class="priority6 has-text-centered">{value}</td>
{:else}
  <td on:click={ClickCell} class="has-background-light has-text-centered" >{value}</td>
{/if}
