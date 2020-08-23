<script>
  import { onMount } from "svelte";
  import MenuM from "../../components/NavMaster.svelte";

  let MenuOpen = false;

  function ToggleClassMenu() {
    console.log("Toogle");
    MenuOpen = !MenuOpen;
  }
</script>

<style>

</style>

<MenuM></MenuM>


<!-- Main container -->
<nav class="level">
  <!-- Left side -->
  <div class="level-left">
    <div class="level-item">
      <p class="subtitle is-5">
        <strong>123</strong> posts
      </p>
    </div>
    <div class="level-item">
      <div class="field has-addons ">
        <p class="control " >
          <input class="input is-small" type="text" placeholder="Find a post">
        </p>
        <p class="control">
          <button class="button is-small">
            Search
          </button>
        </p>
      </div>
    </div>
  </div>

  <!-- Right side -->
  <div class="level-right">
    <p class="level-item"><strong>All</strong></p>
    <p class="level-item"><a>Published</a></p>
    <p class="level-item"><a>Drafts</a></p>
    <p class="level-item"><a>Deleted</a></p>
    <p class="level-item"><a class="button is-success is-small">New</a></p>
  </div>
</nav>
<div>Prueba de text 2</div>
