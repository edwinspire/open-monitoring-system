//Funciones adicionales de cadenas
// Convierte una cadena en Booleano
String.prototype.to_boolean = function () {
    var Return = false;
    if (this == 'false' || this == 'FALSE') {
        Return = false;
    } else {
        Return = Boolean(this);
    }
    return Return;
}

// Convierte un string en Date
String.prototype.pg_to_boolean = function () {
    var r = false;
    if (this == 't' || this == 'on' || this == 'checked') {
        r = true;
    } else {
        r = false;
    }
    return r;
}

// Convierte un string en Date
String.prototype.pg_to_date = function () {
    // Convierte una cadena de fecha devuelta desde postgres a Date
    var st = this.replace(/-/g, "/").split(".");
    var f = new Date(st[0]);
//console.log(f);
    return f;
}

String.prototype.to_number = function () {
    return Number(this);
}

String.prototype.to_float = function () {
    return parseFloat(this);
}

String.prototype.to_int = function () {
    return parseInt(this);
}

String.prototype.to_b64 = function () {
    return btoa(unescape(encodeURIComponent(this)));
}
//TODO: Solucionar el problema con saltos de linea
String.prototype.from_b64 = function () {
    var r = '';
    try
    {
        r = decodeURIComponent(escape(atob(this.replace(/\s/g, ''))));
    }
    catch (err)
    {
        console.log(err);
    }
    return r;
}



