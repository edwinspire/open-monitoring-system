<script>
  import { onMount, createEventDispatcher } from "svelte";
  import MenuDivisions from "./MenuDivisions.svelte";
  import MenuCustom from "./MenuCustom.svelte";

  let MenuOpen = false;
  const dispatch = createEventDispatcher();
  function ToggleClassMenu() {
    console.log("Toogle");
    MenuOpen = !MenuOpen;
  }

  function HandleClickMenu(event) {
    console.log("Emite", event.target.dataset.button);
    dispatch("button", { button: event.target.dataset.button });
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
        <slot name="title">
          <strong>OPEN MONITORING SYSTEM</strong>
        </slot>
      </a>

    </div>

    <div class="navbar-end is-size-7">

      <div class="navbar-item has-dropdown is-hoverable ">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="navbar-link">
          <span class="icon">
            <i class="fa fa-cogs" aria-hidden="true" />
          </span>
          <span>Sistema</span>
        </a>

        <div class="navbar-dropdown is-boxed is-right">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="navbar-item"
            data-button="system.events"
            on:click={HandleClickMenu}>
            Eventos
          </a>
          <!-- svelte-ignore a11y-missing-attribute -->
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a
            class="navbar-item"
            data-button="system.endpoints"
            on:click={HandleClickMenu}>
            Endpoints
          </a>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
          class="navbar-item"
          data-button="system.divisions"
          on:click={HandleClickMenu}>
          Divisiones
        </a>
        </div>
      </div>

      <MenuDivisions />
      <MenuCustom />
      <div class="navbar-item">
        <div class="buttons">

          <a class="bd-tw-button button is-small is-dark" href="/">
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
