<script>
  export const Edit = false;
  let Save = false;
  let Delete = false;
  let Search = false;
</script>

<style>
  .root {
    padding: 0.3em;
    margin-bottom: 1px;
  }
</style>

<!-- Main container -->
<nav class="is-mobile  level root">
  <!-- Left side -->
  <div class="level-left">
    <div class="level-item">
      <p class="subtitle is-5">
        <b>
          <slot name="Title" />
        </b>
      </p>
    </div>

  </div>

  <!-- Right side -->
  <div class="level-right">

    <p class="level-item">
      <slot name="Rigth1" />
    </p>

    <p class="level-item">
      <slot name="Rigth2" />
    </p>

    <p class="level-item">
      <slot name="Rigth3" />
    </p>

    <p class="level-item">
      <slot name="Rigth4" />
    </p>
    <p class="level-item">
      <slot name="Rigth5" />
    </p>
  </div>
</nav>
