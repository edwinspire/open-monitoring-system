<script>
  import { onMount } from "svelte";
  import { IdVehicle, APPLocalStorage } from ".././components/Stores.js";
  import { FetchData } from "../components/FetchData.js";

  let FData = new FetchData();
  let idvehicle = "999",
    idaccount = 0,
    account = "",
    date_start = "",
    date_end = "",
    license_plate = "",
    year = "",
    color = "",
    fuel_tank_capacity = "",
    vin = "",
    name = "",
    idmark = "",
    mark_label = "",
    idmodel = "",
    model_label = "",
    idcontact = "",
    firstname = "",
    lastname = "",
    identification = "",
    birthday = "",
    lfname = "Hola Mundo",
    idcontacttype = "",
    contacttype_label = "",
    idgender = "",
    gender_label = "",
    idfueltype = "",
    fueltype_label = "",
    idunit_measure_fuel_tank = "",
    unit_measure_fuel_tank_label = "";

  onMount(async () => {
    let aps = new APPLocalStorage();
    idvehicle = aps.getPreferences().idvehicle;
    idaccount = aps.getUser().idaccount;
    console.log(idaccount, idvehicle);

    if (idvehicle > 0) {
      var url = "/api/vehicle_summary";

      let res = await FData.get(
        url,
        {
          idaccount: idaccount,
          idvehicle: idvehicle,
        },
        {
          "Content-Type": "application/json",
        }
      );

      let data = await res.json();
      console.log(data);
      if (data.length > 0) {
        let dataresult = data[0];

        idvehicle = dataresult.idvehicle;
        idaccount = dataresult.idaccount;
        account = dataresult.account;
        date_start = dataresult.date_start;
        date_end = dataresult.date_end;
        license_plate = dataresult.license_plate;
        year = dataresult.year;
        color = dataresult.color;
        fuel_tank_capacity = dataresult.fuel_tank_capacity;
        vin = dataresult.vin;
        name = dataresult.name;
        idmark = dataresult.idmark;
        mark_label = dataresult.mark_label;
        idmodel = dataresult.idmodel;
        model_label = dataresult.model_label;
        idcontact = dataresult.idcontact;
        firstname = dataresult.firstname;
        lastname = dataresult.lastname;
        identification = dataresult.identification;
        birthday = dataresult.birthday;
        lfname = dataresult.lfname;
        idcontacttype = dataresult.idcontacttype;
        contacttype_label = dataresult.contacttype_label;
        idgender = dataresult.idgender;
        gender_label = dataresult.gender_label;
        idfueltype = dataresult.idfueltype;
        fueltype_label = dataresult.fueltype_label;
        idunit_measure_fuel_tank = dataresult.idunit_measure_fuel_tank;
        unit_measure_fuel_tank_label = dataresult.unit_measure_fuel_tank_label;

        //MarkLabel.set(mark_label);
        //LicensePlate.set(license_plate);
      } else {
        alert("No se ha encontrado datos");
      }

      /*
      (async () => {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            idaccount: idaccount,
            idvehicle: idvehicle,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        let data = await res.json();
        console.log(data);
        if (data.length > 0) {
          let dataresult = data[0];

          idvehicle = dataresult.idvehicle;
          idaccount = dataresult.idaccount;
          account = dataresult.account;
          date_start = dataresult.date_start;
          date_end = dataresult.date_end;
          license_plate = dataresult.license_plate;
          year = dataresult.year;
          color = dataresult.color;
          fuel_tank_capacity = dataresult.fuel_tank_capacity;
          vin = dataresult.vin;
          name = dataresult.name;
          idmark = dataresult.idmark;
          mark_label = dataresult.mark_label;
          idmodel = dataresult.idmodel;
          model_label = dataresult.model_label;
          idcontact = dataresult.idcontact;
          firstname = dataresult.firstname;
          lastname = dataresult.lastname;
          identification = dataresult.identification;
          birthday = dataresult.birthday;
          lfname = dataresult.lfname;
          idcontacttype = dataresult.idcontacttype;
          contacttype_label = dataresult.contacttype_label;
          idgender = dataresult.idgender;
          gender_label = dataresult.gender_label;
          idfueltype = dataresult.idfueltype;
          fueltype_label = dataresult.fueltype_label;
          idunit_measure_fuel_tank = dataresult.idunit_measure_fuel_tank;
          unit_measure_fuel_tank_label =
            dataresult.unit_measure_fuel_tank_label;

          //MarkLabel.set(mark_label);
          //LicensePlate.set(license_plate);
        } else {
          alert("No se ha encontrado datos");
        }
      })();

      */

      //console.log(data);
    } else {
      alert("Debe seleccionar un vehículo");
      window.location.href = "/vehicles";
    }
  });
</script>

<style>
  
</style>

<article class="container is-fluid">
  <div class="columns is-multiline is-mobile">
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Propietario</label>
          <div class="control is-small">
            <input type="text" class="input is-small" value={lfname} readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Placa</label>
          <div class="control is-small">
            <input
              placeholder="Placa"
              type="text"
              class="input is-small"
              value={license_plate}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Marca</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              value={mark_label}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Año</label>
          <div class="control is-small">
            <input type="number" class="input is-small" value={year} readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">VIN</label>
          <div class="control is-small">
            <input type="text" class="input is-small" value={vin} readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Color</label>
          <div class="control is-small">
            <input type="color" class="input is-small" value={color} readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Tipo de combustible</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              value={fueltype_label}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Capacidad del tanque</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              value={fuel_tank_capacity}
              readonly />
          </div>
        </div>
      </span>
    </div>
    <div class="column is-one-third-tablet is-half-mobile is-one-quarter-fullhd
    is-one-quarter-widescreen is-one-quarter-desktop">
      <span>
        <div class="field">
          <label class="label is-small">Unidad de medida del tanque</label>
          <div class="control is-small">
            <input
              type="text"
              class="input is-small"
              value={unit_measure_fuel_tank_label}
              readonly />
          </div>
        </div>
      </span>
    </div>


  </div>
 
 

</article>
