<script>
    import { onMount } from "svelte";
    import { User, IdUser, IdAccount, IdVehicle, LicensePlate, MarkLabel, NameVehicle, Vin, UserFullName } from ".././components/Stores.js";
  
    onMount(async () => {
      console.log("Inicio Layout");
      if (typeof Storage !== "undefined") {
  
        let DataUser = JSON.parse(localStorage.getItem("User"));
        console.log(DataUser);
        await User.set(DataUser);
        await IdUser.set(DataUser.iduser);
        await IdAccount.set(DataUser.idacount);
        await IdVehicle.set(DataUser.preferences.last_vehicle_selected.idvehicle);
        await LicensePlate.set(DataUser.preferences.last_vehicle_selected.license_plate);
        await MarkLabel.set(DataUser.preferences.last_vehicle_selected.mark_label);
        await NameVehicle.set(DataUser.preferences.last_vehicle_selected.name);
        await Vin.set(DataUser.preferences.last_vehicle_selected.vin);
        await UserFullName.set(DataUser.fullname);      
  
        const unsubscribe = User.subscribe((valueUser) => {
          console.log("El Store se ha actualizado USER");
          localStorage.setItem("User", JSON.stringify(valueUser));
        });
  
  
        const unsubscribe2 = IdVehicle.subscribe((valueUser) => {
          console.log("El Store se ha actualizado VEHI", valueUser, {$IdVehicle});
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
  