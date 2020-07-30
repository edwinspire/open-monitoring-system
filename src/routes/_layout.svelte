<script>
  
  import { onMount } from "svelte";
  import { User, IdAccount, IdVehicle } from ".././components/Stores.js";


  onMount(async () => {
    
    function SavePreferences() {
      console.log(
        "Aqui se debe enviar los cambios de preferencias al servidor"
      );
    }

    if (typeof Storage !== "undefined") {
      let storageUser = localStorage.getItem("User");

      
      if (storageUser !== "undefined") {
        let DataUser = JSON.parse(storageUser);
        if (DataUser) {
          await User.set(DataUser);
          if(DataUser.idacount && DataUser.preferences && DataUser.preferences.idvehicle){
            await IdAccount.set(DataUser.idacount);
          await IdVehicle.set(DataUser.preferences.idvehicle);
          }
          //await UserFullName.set(DataUser.fullname);
        }
      }

      const unsubscribe = User.subscribe((valueUser) => {
        //console.log("El Store se ha actualizado USER");
        localStorage.setItem("User", JSON.stringify(valueUser));
      });

      const unsubscribe2 = IdVehicle.subscribe((valueUser) => {
        /*
        console.log("El Store se ha actualizado VEHI", valueUser, {
          $IdVehicle
        });
        */
        SavePreferences();
      });

      /*    
      const unsubscribePreferences = Preferences.subscribe((valuePref) => {
        console.log("El Store se ha actualizado Preferences");
        localStorage.setItem("Preferences", JSON.stringify(valuePref));
      });
*/
      window.addEventListener("storage", (e) => {
        console.log(e);
      });
    } else {
      alert("No compatible");
    }
  });
</script>

<style>
  main {
    position: relative;
    /* max-width: 56em; */
    min-width: 100%;
    background-color: white;
    /* padding: 2em; */
    display: contents;
    margin: 0 auto;
  }


</style>

<!-- <Nav {segment}/> -->

<main>
  <slot />
</main>
