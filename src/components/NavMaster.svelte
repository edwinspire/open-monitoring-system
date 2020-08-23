<script>
  import { onMount } from "svelte";
  import MenuDivisions from "./MenuDivisions.svelte";

  let MenuOpen = false;

  function ToggleClassMenu() {
    console.log("Toogle");
    MenuOpen = !MenuOpen;
  }
</script>


<nav
  class="navbar gbackground-silver"
  role="navigation"
  aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/home">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="logo.png" width="25" height="25" />
    </a>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      on:click={ToggleClassMenu}
      role="button"
      class:is-active={MenuOpen}
      class="navbar-burger burger"
      aria-label="menu"
      aria-expanded="false">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div class="navbar-menu" class:is-active={MenuOpen}>
    <div class="navbar-start is-size-7">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="navbar-item">
          <slot name="title"><strong>OPEN MONITORING SYSTEM</strong></slot>
      </a>

    </div>

    <div class="navbar-end is-size-7">

      <MenuDivisions />
      <div class="navbar-item">
        <div class="buttons">
            <a class="bd-tw-button button is-small is-dark" href="/system">
                <span class="icon">
                    <i class="fas fa-cogs"></i>
                </span>
                <span>Sistema</span>
              </a>

          <a class="bd-tw-button button is-small is-primary" href="/">
            <span class="icon">
              <i class="fas fa-sign-out-alt" />
            </span>
            <span>Salir</span>
          </a>

        </div>
      </div>
    </div>
  </div>
</nav>
