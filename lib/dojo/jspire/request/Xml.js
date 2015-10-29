//>>built
define("jspire/request/Xml", ["dojo/_base/declare", "jspire/String"], function () {

    return {
        getFromXhr: function (xmldoc, getElementsByTagName) {
            this.xml = xmldoc,
                    this.ElementsByTagName = getElementsByTagName,
                    this.rows = this.xml.getElementsByTagName(this.ElementsByTagName),
                    this.length = this.rows.length,
                    this.getValue = function (i, field) {
                        var r = '';

                        try {
                            r = this.rows[i].getElementsByTagName(field).item(0).firstChild.data;
                        }
                        catch (e) {
                            r = '';
//console.log(e);
                        }

                        return r;
                    },
                    this.getBool = function (i, field) {
                        return this.getString(i, field).to_boolean();
                    },
                    this.getNumber = function (i, field) {
                        return Number(this.getValue(i, field));
                    },
                    this.getInt = function (i, field) {
                        return parseInt(this.getValue(i, field));
                    },
                    this.getFloat = function (i, field) {
                        return parseFloat(this.getValue(i, field));
                    },
                    this.getString = function (i, field) {
                        return String(this.getValue(i, field));
                    },
                    this.getDate = function (i, field) {
                        var x = Date.parse(this.getString(i, field));
                        return new Date(x);
                    },
                    this.getStringFromB64 = function (i, field) {
                        return this.getString(i, field).from_b64();
                    }
        },
        getFromXmlStore: function (xmlstore, xmlitems) {
            this.store = xmlstore,
                    this.items = xmlitems,
                    this.lengthItems = this.items.length,
                    this.getValue = function (i, field) {
                        return this.store.getValue(this.items[i], field);
                    },
                    this.getBool = function (i, field) {
                        return this.getString(i, field).to_boolean();
                    },
                    this.getNumber = function (i, field) {
                        return Number(this.getValue(i, field));
                    },
                    this.getInt = function (i, field) {
                        return parseInt(this.getValue(i, field));
                    },
                    this.getFloat = function (i, field) {
                        return parseFloat(this.getValue(i, field));
                    },
                    this.getString = function (i, field) {
                        return String(this.getValue(i, field));
                    },
                    this.getDate = function (i, field) {
                        var x = Date.parse(this.getString(i, field));
                        console.log(this.getString(i, field) + ' >> ' + x)
                        return new Date(x);
                    },
                    this.getStringFromB64 = function (i, field) {
                        return this.getString(i, field).from_b64();
                    }
        }


    }
});
