<script>
  import { onMount } from "svelte";
  import Menu from "../../components/Menu.svelte";
  import SummaryDivisions from "../../components/SummaryDivisions.svelte";
  import { FetchData } from "../../components/FetchData.js";
  import { IdAccount, APPLocalStorage } from "../../components/Stores.js";

  let FData = new FetchData();
  let AppLS = new APPLocalStorage();

  export let segment;
  let promise = GetData();
  let idaccount = 0;

  

  async function GetData(search) {
    let query = {};
    const res = await FData.get("/pgapi/v2/divisions", query, {
      "Content-Type": "application/json",
    });

    if (res.ok) {
      return res.json();
    } else {
      throw new Error("No se pudo cargar la información");
    }
  }

  onMount(async () => {
    //AppLS = new APPLocalStorage();
    //idaccount = AppLS.getUser().idaccount;
  });
</script>

<style>
/*  .icon_link a {
    color: white;
  }

  .icon_link a:hover {
    color: rgb(255, 102, 0);
  }*/
</style>

<Menu {segment} >
  <span slot="Title">
    <i class="fas fa-shield-alt"></i>
    OPEN MONITORING SYSTEM
  </span>

</Menu>

<div class="columns is-multiline is-mobile root">
  {#await promise}
    <p>...waiting</p>
  {:then datas}
    {#each datas as { iddivision, name}, i}
      <div
        class="column is-half-mobile is-one-third-tablet is-one-quarter-fullhd
        is-one-quarter-widescreen is-one-quarter-desktop">

        <SummaryDivisions name={name} iddivision={iddivision}></SummaryDivisions>

      </div>

      <!-- <User {...{ login, url }} /> -->
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}

</div>
