<script>
  import { createEventDispatcher } from "svelte";

  export let ShowSearch = false;
  export let ShowR0 = false;
  export let ShowR1 = false;
  export let ShowR2 = false;
  export let ShowR3 = false;
  export let ShowR4 = false;
  export let ShowR5 = false;
  export let ShowL0 = false;
  export let ShowL1 = false;
  export let ShowL2 = false;
  export let ShowL3 = false;
  export let ShowL4 = false;
  export let ShowL5 = false;
  let class_menu = "close";
  let text_search = '';


  const dispatch = createEventDispatcher();

  function handleClickSearch() {
    dispatch("search", {
      text: text_search,
    });
  }

  function openNav() {
    class_menu = "open";
  }

  function closeNav() {
    class_menu = "close;";
  }
</script>

<style>
  .sidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 99;
    top: 0;
    right: 0;

    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
  }

  .sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 1.2em;

    display: block;
    transition: 0.3s;
  }

  .sidenav a:hover {
    color: #f1f1f1;
  }

  @media screen and (max-height: 450px) {
    .sidenav {
      padding-top: 15px;
    }
    .sidenav a {
      font-size: 18px;
    }
  }

  .open {
    width: 250px;
  }
  .subt {
    color: azure;
  }
  .close {
    width: 0px;
  }
  .root {
    padding: 0.2em 1em 0.2em 0.5em;
    margin-bottom: 0.5rem;
  }

  .has-background-dark a {
    color: white;
  }

  .has-background-dark a:hover {
    color: rgb(255, 102, 0);
  }

  .size_search{
width: 10em;    
  }

</style>

<div class="sidenav has-background-dark {class_menu}">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="" on:click={closeNav}>
    <i class="far fa-window-close" />
  </a>
  <a href="home">
    <i class="fas fa-home" />
    HOME
  </a>
  <a href="contacts">
    <i class="fas fa-users" />
    CONTACTOS
  </a>
  <a href="vehicles">
    <i class="fas fa-car-side" />
    VEHICULOS
  </a>
  <a href="/">
    <i class="fas fa-power-off" />
    SALIR
  </a>
</div>

<!-- Main container -->
<nav class=" level has-background-dark is-mobile root">
  <!-- Left side -->
  <div class="level-left">
    <div class="has-text-light level-item">
      <p class="has-text-weight-bold">
        <slot name="Title">INDEX</slot>
      </p>
    </div>

    {#if ShowL0}
    <p class="level-item">
      <slot  name="L0"></slot>
    </p>    
    {/if}
    {#if ShowL1}
    <p class="level-item">
      <slot  name="L1"></slot>
    </p>
    {/if}

    {#if ShowL2}
    <p class="level-item">
      <slot  name="L2"></slot>
    </p>
    {/if}

    {#if ShowL3}
    <p class="level-item">
      <slot  name="L3"></slot>
    </p>
    {/if}

    {#if ShowL4}
    <p class="level-item">
      <slot  name="L4"></slot>
    </p>
    {/if}
    {#if ShowL5}
    <p class="level-item">
      <slot  name="L5"></slot>
    </p>
    {/if}

  </div>

  <!-- Right side -->
  <div class="level-right">

   
    {#if ShowR0}
    <p class="level-item">
      <slot  name="R0"></slot>
    </p>    
    {/if}

    {#if ShowR1}
    <p class="level-item">
      <slot  name="R1"></slot>
    </p>
    {/if}

    {#if ShowR2}
    <p class="level-item">
      <slot  name="R2"></slot>
    </p>
    {/if}

    {#if ShowR3}
    <p class="level-item">
      <slot  name="R3"></slot>
    </p>
    {/if}

    {#if ShowR4}
    <p class="level-item">
      <slot  name="R4"></slot>
    </p>
    {/if}
    {#if ShowR5}
    <p class="level-item">
      <slot  name="R5"></slot>
    </p>
    {/if}




    {#if ShowSearch}
      <div class="level-item">
        <div class="field has-addons">
          <p class="control">
            <input class="input size_search is-small" type="text" placeholder="Buscar" bind:value={text_search} />
          </p>
          <p class="control">
            <button class="button is-small" on:click={handleClickSearch}>
              <i class="fas fa-search" />
            </button>
          </p>
        </div>
      </div>
    {/if}

    <!-- svelte-ignore a11y-missing-attribute -->
    <p class="level-item" />
    <p class="level-item ">
      <!-- svelte-ignore a11y-missing-attribute -->
      <a style="cursor:pointer" on:click={openNav}>
        <i class="fas fa-bars" />
      </a>
    </p>

  </div>
</nav>
