<div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                  <div class="x_title">
                                      <h2>
                    <span data-dojo-attach-point="NameLabel" class="title">Nombre</span> 
                    <small data-dojo-attach-point="IdentificationLabel" >0000000000</small>
                    </h2>
                    <ul class="nav navbar-right panel_toolbox">
                      <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>
                           
                    </ul>
                    <div class="clearfix"></div>
                  </div>
                  <div class="x_content">
                    <br>

     
             
                    <div>
    <fieldset>
                      <legend >Habilitado</legend>

                        <span class="input-group">
         
<div name="enabled" class="ContactWidget_class_udc" data-dojo-type="Switch/Switch" value="false"></div> 
            </span>
                      </fieldset>  
                    
</div>      
                   
                     
                      <fieldset>
                      <legend>Nombre</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-user" class="ContactWidget_class_udc" placeholder="Nombre" name="first_name"></span>				
                      </fieldset>  
                      
                      
                      <fieldset>
                      <legend>Apellido</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-user" placeholder="Apellido" name="last_name" class="ContactWidget_class_udc"></span>					
                      </fieldset>  
                      

                      <fieldset>
                      <legend>Division</legend>

<div  data-dojo-type="FilteringSelectAjax/FilteringSelectAjax" class="input-group ContactWidget_class_udc" name="iddivision">
</div>
         			
                      </fieldset> 

                      <fieldset>
                      <legend>Cumpleanos</legend>
              <div data-dojo-type="DateTextbox/DateTextbox" class="ContactWidget_class_udc" name="birthday"></div>
                      </fieldset> 



<fieldset>
<legend >Tipe ID</legend>
            
<div data-dojo-type="FilteringSelectAjax/FilteringSelectAjax" data-select-config="{Url: 'php/query/select_by_ajax.php', LoadOnCreate: true, Table: 'identification_types', FieldLabel: 'name', FieldValue: 'ididtype'}" class="ContactWidget_class_udc" name="ididtype"></div>
                      
</fieldset>
                      



                  

                      
                      <fieldset>
                      <legend>Identification</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-barcode" placeholder="Identificación" name="identification" class="ContactWidget_class_udc"></span>					
                      </fieldset>  
                      
                      
                      <fieldset>
                      <legend>Codigo Postal</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-envelope" placeholder="Código postal" name="postal_code" class="ContactWidget_class_udc"></span>					
                      </fieldset>  
                      
                      
                      <fieldset>
                      <legend>Genero</legend>
                  <div data-dojo-type="SelectGender/SelectGender" class="ContactWidget_class_udc" name="gender"></div>
                      </fieldset>  
                      
                      
                      <fieldset>
                      <legend>Latitud</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-map-marker" placeholder="Latitud" value="0" class="ContactWidget_class_udc" name="geox"></span>					
                      </fieldset>  
                      
                                                                                                                                                                                                                              
                          <fieldset>
                      <legend>Longitud</legend>
<span data-dojo-type="Input/Input" data-input-icon="glyphicon glyphicon-map-marker" placeholder="Longitud"  value="0" class="ContactWidget_class_udc" name="geoy"></span>					
                      </fieldset>  
  
                   <div class="clearfix"></div>
                        
           <div class="col-md-6 col-sm-6 col-xs-12">
                           <fieldset style="width: 100%;">
                      <legend>Direccion</legend>
                      <textarea  type="text" data-dojo-type="dijit/form/Textarea" style="height: auto; width: 100%;" name="address" class="ContactWidget_class_udc"></textarea>
                      </fieldset>                         
</div>

           <div class="col-md-6 col-sm-6 col-xs-12">
                           <fieldset style="width: 100%;">
                      <legend>Direccion Ref</legend>
                      <textarea  type="text" data-dojo-type="dijit/form/Textarea" style="height: auto; width: 100%;" class="ContactWidget_class_udc" name="address_ref"></textarea>
                      </fieldset>    
</div>

          <div class="clearfix"></div>
          


           <div class="col-md-12 col-sm-12 col-xs-12">
                           <fieldset style="width: 100%;">
                      <legend>Notas</legend>
                      <textarea data-dojo-type="dijit/form/Textarea" style="height: auto; width: 100%;" class="ContactWidget_class_udc"  placeholder='Notas' name="note" class="ContactWidget_class_udc"></textarea>
                      </fieldset>  
</div>


<div class="clearfix"></div>
                      <div class="col-md-6 col-sm-6 col-xs-12">
 <div data-dojo-type="uDC_dgrid/uDC_dgrid"  data-udc-dgrid-config="{Columns:{Url: 'js/dojo/custom/uDC_dgrid/uDC_dgrid_columns.php', Fields: {}}, UrlExport:'',  Data:{Url: 'php/grid/generic_grid.php'}, RefreshOnTableChanged: ['events'], Title:'Telefonos', Table: 'view_events_monitor_general', IndirectSelect: true, idProperty: 'idevent'}"></div>                         
</div>

           <div class="col-md-6 col-sm-6 col-xs-12">
 <div data-dojo-type="uDC_dgrid/uDC_dgrid"  data-udc-dgrid-config="{Columns:{Url: 'js/dojo/custom/uDC_dgrid/uDC_dgrid_columns.php', Fields: {}}, UrlExport:'',  Data:{Url: 'php/grid/generic_grid.php'}, RefreshOnTableChanged: ['events'], Title:'Email', Table: 'view_events_monitor_general', IndirectSelect: true, idProperty: 'idevent'}"></div>    
</div>      
                   
              
<div class="clearfix"></div>



                  </div>
                </div>

<div data-dojo-type="uDC/uDC" data-dojo-attach-point="uDC" data-udc-config="{HiddenFields: [{name: 'idcontact'}], SelectorClass: '.account_form_basic_class_udc', NodeContainer: '${id}', UrlData: 'php/query/accounts.php', Table: 'accountsx', idProperty: 'idcontact',  UrlFieldTypes: 'js/dojo/custom/uDC/uDCFieldTypes.php'}"></div>                
                
              </div>

