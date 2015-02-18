define("jspire/request/dbDocument",["dojo/_base/declare", 'dojo/request', 'dojo/query'],function(_1, _2, _3){

var r = function(){

};
//r.id = null;
r.change = false,
r.prototype = {

_data: [],

url: "default_query.json",

_wdijit: [],
_wdojo: [],

bind_document: function(_name){
var t = this;

var f = _3("[data-dbDocument]='"+_name+"'");

f.forEach(function(node){

var d = dijit.byId(node.id);

if(d){
t._wdijit.push(d);
t._connect_dijit_onchanged(d);
}else{

d = node;

if(d){
t._wdojo.push(d);
t._connect_dojo_onchanged(d);
}
}

});

}, 

_set_values_onload: function(_data){
	var t = this;
	var name;
	var value;
	for(var i = 0; i < t._wdijit.length; i++){
		name = t._wdijit[i].get("name");
		if(name){
			value = _data[name];
			
			if(value){
				t._wdijit[i].set("value", value);
			}else{
			console.log('No hay valor para el nombre: '+name);
			}
				
		}else{
			console.log('El widget no tiene la propiedad: '+name);
			}
	}


	for(var i = 0; i < t._wdojo.length; i++){
		name = t._wdojo[i].name;
		if(name){
			value = _data[name];
			
			if(value){
				t._wdojo[i].value = value;
			}else{
			console.log('No hay valor para el nombre: '+name);
			}
				
		}else{
			console.log('El elemento no tiene la propiedad: '+name);
			}
	}

},

_connect_dijit_onchanged: function(_w){
	var t = this;
	
//	console.log(_w);
	
	if(_w.get('name')){

	_w.on('Change', function(v){
	
	t._data[this.get('name')] = v;				
		t.change = true;
	});

		}else{
	console.error('El widget '+_w+' no tiene la propiedad name.');
		}
	
	
	
},


_connect_dojo_onchanged: function(_input){
	var t = this;
	
		if(_input.name){
	
	dojo.connect(_input, 'onchange', function(v){
			t._data[this.name] = this.value;
			t.change = true;
	});
					
		}else{
			console.error('El elemento '+_input+' no tiene la propiedad name.');
		}
	
	
	
},

_post: function(_data, _query_type){
var t = this;
if(_data){
_data.query_type = _query_type;
   _2.post(t.url, {
		data: _data,
            handleAs: 'json'
        }).then(
                function(response){
               		t._data = response;
               		               		
               		switch(_query_type){
               			case 'load':
               		t._set_values_onload(response);
               		t.change = false;
               		t.emit('onLoad', response);	
               			break;
               			case 'save':
               		t.emit('onSave', response);	
               			break;	
               			case 'delete':
               		t.emit('onDelete', response);	
               			break;	
               		}
               		
               		
               		
                },
                function(error){
                    // Display the error returned
console.log(error);
                }
            );
     }else{
console.log('El Id '+t.id+' no es válido.');     
     }
},
// Este método trae los datos usando Post segun el Id del registro.
load: function(idrow){
//this.id = idrow;
this._post(this._data, 'load');	
},
// Envia los datos al servidor para ser guardados.
save: function(){
//console.log('No están definidos aun los campos a ser usados.');
this._post(this._data, 'save');	
},
// Elimina el registro segun el Id del registro cargado.
delete: function(){
this._post(this._data, 'delete');	
}

};

return r;
});
