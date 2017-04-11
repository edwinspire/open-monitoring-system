// Dojo 1.7+ (AMD)
require(["dojo/_base/lang", "api/postgres/oms",  "dojo/node!pg", "dojo/_base/array"], function(lang, OMS, pg, array){
	lang.extend(OMS, {
/////////////////////////////////////////
Insert: function(_table, _fieldsValues, _omitfields){
	var t = this;
	_omitfields = _omitfields || [];
	var r = {table: _table, fieldsValues: _fieldsValues, omitfields: _omitfields, _returning: false};

	r.returning = function(_string_returning){
		this._returning = _string_returning || false;
		return this;
	}

	r.build = function(){
		var param = [];
		var q = "INSERT INTO "+this.table+" (";
		var i = 1;
		var tvf = t.get_tv_fieldtypes(this.table);

		var array_fields = [];
		var array_types = [];
		for(var f in this.fieldsValues){

			if(tvf[f] && array.indexOf(this.omitfields, f) < 0){
				array_types.push(f);		
				array_fields.push("$"+i+"::"+tvf[f]);
				param.push(this.fieldsValues[f]);
				i++;
			}

		}

		q = q+array_types.join(", ")+") VALUES ("+array_fields.join(", ")+")";

		if(this._returning && this._returning.length > 0){
			q = q+" RETURNING "+this._returning;
		}

		return {query: q, param: param};
	}

	return r;
},
/////////////////////////////////////////
Select: function(_tableview, _fields, _required_list_fields){

	var t = this;
	_required_list_fields = _required_list_fields || false;

	var r = {table: _tableview, _whereOr: false, _whereAnd: false, _orderBy: false, _where: false,  _limit: false, select_field_required: _required_list_fields, select_fields: _fields, fieldtypes: t.get_tv_fieldtypes(_tableview)};
	r.whereOr = function(_param, _omitfields){
		this._whereOr = this._query_builder_where_check(this.fieldtypes, _param, _omitfields)
		return this;
	}

	r.whereAnd = function(_param, _omitfields){
		this._whereAnd = t._query_builder_where_check(this.fieldtypes, _param, _omitfields)
		return this;
	}

	r.where = function(_where){
		this._where = _where;
		
		return this;
	}

// TODO: Esta pendiente de verificar
r.orderBy = function(_fields_array){

	if(typeof _fields_array === 'string'){

		this._orderBy = _fields_array;

	}else if(Object.prototype.toString.call( _fields_array ) === '[object Array]'){

		this._orderBy = [];
		
		array.forEach(_fields_array, function(field){

			for(var _f in _field) { 

				if(t.fieldtypes[_f]){
					this._orderBy.push(field);
				}

			}

		});

	}else{
		this._orderBy = false;
	}
	
	return this;
}

//------------------------------
r.limit = function(_limit){
	this._limit = _limit;
	return this;
}


//---------------------------
r.build = function(){

	var q = "SELECT ";
	var param = [];

//------------------------------
if(!this.select_field_required && this.select_fields.length < 1){
	q = q+" * FROM "+this.table;
}else{
	
	
	if(typeof this.select_fields === 'string'){
		q = q+" "+this.select_fields+" FROM "+this.table;

	}else if(Object.prototype.toString.call( this.select_fields ) === '[object Array]'){

		q = q+t._select_check_fields(this.fieldtypes, this.select_fields).join()+" FROM "+this.table;

	}	
	
	
}


//------------------------------
var wb = t._query_builder_build_where(this._where, this._whereAnd, this._whereOr);
console.log(wb);
q = q+" "+wb.where;
param = wb.param;


//------------------------------------------
if(this._orderBy && this._orderBy.length > 0){

	if(typeof this._orderBy === 'string'){
		q = q+" ORDER BY "+this._orderBy;

	}else if(Object.prototype.toString.call( this._orderBy ) === '[object Array]'){

		var o = [];

		array.forEach(this._orderBy, function(_field){

			for(var _f in _field) { 
				o.push(" "+_f+" "+_field[_f]);
			}

		});

		q = q+" ORDER BY "+o.join();

	}

}


//------------------------------------------------
if(this._limit && this._limit > 0){
	q = q+" LIMIT "+this._limit;
}


return {query: q, param: param};
}




return r;
},
_query_builder_where_check: function(_fieldtypes, _param, _omitfields){

	var t = this;
	_omitfields = _omitfields || [];
	_param = _param || [];

	var w = [];
	
	array.forEach(_param, function(_p){

		for(var _field in _p){
			if(_fieldtypes[_field]){

// Esto es para omitir los campos pasados en una lista (array)
if(array.indexOf(_omitfields, _field) == -1){
	w.push({data_type: _fieldtypes[_field], field: _field, value: _p[_field]});
}

}
}

});

	return w;
},
/////////////////////////////////////////
_query_builder_build_where: function(_where, _whereAnd, _whereOr, _param_init){

	_param_init = _param_init || 0;
	var q = "";
	var param = [];

//------------------------------
// Construye el bloque where de un query
if(_where && _where.length > 0){

	var q = q+" WHERE "+_where;

}else{

	var and = false;
	var array_where = [];
	if(_whereAnd.length > 0){
//	where = this._whereAnd;
and = true;
array.forEach(_whereAnd, function(w, i){
	array_where.push(w.field+" = $"+(i+1+_param_init)+"::"+w.data_type);
	param.push(w.value);
});		

}else if(_whereOr.length > 0){
	array.forEach(_whereOr, function(w, i){
		array_where.push(w.field+"= $"+(i+1+_param_init)+"::"+w.data_type);
		param.push(w.value);
	});		
}

//---------------------------------------------
if(array_where.length > 0 && and){
	q = q+" WHERE "+array_where.join(" AND ");
}else if(array_where.length > 0 && !and){
	q = q+" WHERE "+array_where.join(" OR ");
}

}

return {where: q, param: param}
},
/////////////////////////////////////////
_select_check_fields: function(_fieldstv, _fields){
// Revisa que los campos solicitados correspondan a la tabla o vista solicitada, devuelve una matriz con los campos validos y su tipo
var t = this;
var r = [];

array.forEach(_fields, function(field){

	if(_fieldstv[field]){
		r.push(field);
	}
	
});

return r;
},
/////////////////////////////////////////
// Obtiene un objecto con los campos y tipos validos
get_tv_fieldtypes: function(_tableview){
	var t = this;
	var tableColumns = t.get_table_schema(_tableview) || {};
	var r = {};
	array.forEach(tableColumns, function(field){
		r[field.column_name] = field.data_type; 
	});

//console.trace(r);
	return r;
},
////////////////////////////////////////////////////////////
Update: function(_table, _values_array, _omitfields){
	var t = this;
	var r = {table: _table, values: _values_array, omitfields: _omitfields, _whereOr: false, _whereAnd: false, _where: false, fieldtypes: t.get_tv_fieldtypes(_table)};
	r.whereOr = function(_param, _omitfields){
		this._whereOr = this._query_builder_where_check(this.fieldtypes, _param, _omitfields)
		return this;
	}

	r.whereAnd = function(_param, _omitfields){
		this._whereAnd = t._query_builder_where_check(this.fieldtypes, _param, _omitfields)
		return this;
	}

	r.where = function(_where){	
		this._where = _where;
		return this;
	}

	r.returning = function(_string_returning){
		this._returning = _string_returning || false;
		return this;
	}

	r.build = function(){

		var q = "UPDATE "+this.table+" SET ";
		var param = [];

//---------------------------
// Revisamos que los campos a setear sean correctos
if(typeof this.values == "string"){

	t.emit("tschange", {values: this.values});
	q = q+" "+this.values;


}else if(this.values){

//var v = t._select_check_fields(this.fieldtypes, t.values);
var valuesAndTypes = [];

t.emit("tschange", {fieldtypes: this.fieldtypes});
var i = 1;

for(var v in this.values){

	if(this.fieldtypes[v] && array.indexOf(this.omitfields, v) < 0){
		valuesAndTypes.push(v+" = $"+(i)+"::"+this.fieldtypes[v]);
		param.push(this.values[v]);
		i++;
	}

}


q = q+valuesAndTypes.join(", ");
t.emit("tschange", {q: valuesAndTypes});

}

//------------------------------
var wb = t._query_builder_build_where(this._where, this._whereAnd, this._whereOr, param.length);
console.log(wb);
q = q+" "+wb.where;
//param = wb.param;

array.forEach(wb.param, function(p){
	param.push(p);	
});

if(this._returning && this._returning.length > 0){
	q = q+" RETURNING "+this._returning;
}
//t.emit("tschange", {q: q, p: param});

return {query: q, param: param};
}

return r;
}







});
});
