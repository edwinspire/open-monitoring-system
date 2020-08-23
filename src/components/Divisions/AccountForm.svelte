<script>
  import { FetchData } from "../FetchData.js";
  import ModalMessage from "../ModalMessage.svelte";
  import SelectURL from "../SelectFromUrl.svelte";
  export let Account;
  export let Show = false;
  let loading = false;

  let FData = new FetchData();

  $: {
    console.log({ Account });
  }

  async function SaveData() {
    console.log(Account);
    loading = true;
    let dataReturn;
    try {
      if (Account.idaccount && Account.idaccount > 0 && Account.iddivision > 0) {
        // Modificar un Method
        const res = await FData.put("/pgapi/v2/account", Account, {
          "Content-Type": "application/json",
        });
        dataReturn = await res.json();
        console.log(dataReturn);
      } else {
        // Inserta un Method nuevo
        const res = await FData.post("/pgapi/v2/account", Account, {
          "Content-Type": "application/json",
        });
        dataReturn = await res.json();
        console.log(dataReturn);
      }
      loading = false;
      Show = false;
    } catch (error) {
      console.error(error);
      loading = false;
    }
  }
</script>

<style>

</style>

{#if Account}

  <ModalMessage bind:Show on:ok={SaveData}>
    <span slot="title">Cuenta</span>
    <div slot="body">
      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Cuenta</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="text"
                placeholder="name"
                bind:value={Account.account_name} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Num. Cuenta</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="text"
                placeholder="account"
                bind:value={Account.account} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Identificación</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="text"
                placeholder="identification"
                bind:value={Account.identification} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Tipo Identificación</label>
        </div>
        <div class="field-body">
          <SelectURL url="/pgapi/v2/select/identification_types" bind:selected={Account.ididtype}/>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Código Postal</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="text"
                placeholder="postal_code"
                bind:value={Account.postal_code} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Latitud</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="number"
                placeholder="latitude"
                bind:value={Account.geox} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Longitud</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="number"
                placeholder="longitude"
                bind:value={Account.geoy} />
            </p>
          </div>
        </div>
      </div>


      <div class="field">
        <label class="label is-small">Dirección</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="address"
            bind:value={Account.address} />
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Dirección Ref.</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="address_ref"
            bind:value={Account.address_ref} />
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Estado Cuenta</label>
        </div>
        <div class="field-body">
          <SelectURL url="/pgapi/v2/select/account_states" bind:selected={Account.idaccountstate}/>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Tipo Cuenta</label>
        </div>
        <div class="field-body">
          <SelectURL url="/pgapi/v2/select/account_types" bind:selected={Account.idaccounttype}/>
        </div>
      </div>


      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Fecha Inicio</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="datetime-local"
                placeholder="date start"
                bind:value={Account.start_date} />
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Fecha Fin</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input
                class="input is-small"
                type="date"
                placeholder="date end"
                bind:value={Account.end_date} />
            </p>
          </div>
        </div>
      </div>


      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">División</label>
        </div>
        <div class="field-body">
          <SelectURL url="/pgapi/v2/select/divisions" bind:selected={Account.iddivision}/>
        </div>
      </div>




      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Es Default</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input type="checkbox" bind:checked={Account.isroot} />
            </p>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label is-small">Nota</label>
        <div class="control">
          <textarea
            class="textarea has-fixed-size"
            placeholder="Notes"
            bind:value={Account.note} />
        </div>
      </div>

    </div>
  </ModalMessage>
{/if}
