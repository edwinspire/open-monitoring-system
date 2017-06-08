define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/json_treeview/json_treeview.html',
    "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel", "dijit/Tree"
    ], function (declare, _Widget, _Templated, templateString, Memory, ObjectStoreModel, Tree) {

        return declare([_Widget, _Templated], {
            widgetsInTemplate: true,
            templateString: templateString,
            _store: new Memory(),
            postCreate: function () {
               var t = this;
          
},

_setValueAttr: function (_v, _t) {
//  console.log(_v);

     var t = this;
var datajson = [];
var i = 0;

 datajson.push({ id: 0, name:'Event'});

/*
var out = Object.keys(_v).map(function(data){

datajson.push({ id: i, name: data, parent: i-1});    
i++;
datajson.push({ id: i, name: _v[data], parent: i-1});
i++;    
        return [data,_v[data]];
    });
   // console.log(out);
*/

var ok = Object.keys({uno: 1, dos: 2, tres: [3, 4, 5, {cuatro: 4, cinco: 5}]});

while(i < 5){

var key = ok[i];
value = _v[key];
console.log(i, key, value);
i++;
}

/*
for(var index in _v) { 
    var attr = _v[index]; 
    //  console.log(attr, index);
     datajson.push( { id: i, name: index, parent: 0});
     datajson.push({ id: i+1, name: attr, parent: i});
     i++;
}
*/

console.log(datajson);

    myStore = new Memory({
        data: [],
        getChildren: function(object){
            // Supply a getChildren() method to store for the data model where
            // children objects point to their parent (aka relational model)
            return this.query({parent: object.id});
        }
    });

myStore.setData(datajson);

    // Create the model
    var myModel = new ObjectStoreModel({
        store: myStore,
        query: {id: 0}
    });

    // Create the Tree.
    var tree = new Tree({
        model: myModel,
        autoExpand: false,
        openOnClick: true,
         showRoot: true,
        getIconClass: function(item, opened) {
          //  console.log(item);
            if (item.type == "country") {
                return "dijitLeaf";
            } else if (item.launched) {
                return (opened ? "dijitFolderOpened" : "dijitFolderClosed");
            } else {
                return (opened ? "dijitFolderOpened" : "dijitFolderClosed");
            }
        }
    });
    tree.collapseAll();
    tree.placeAt(t.domNode);
    tree.startup();


//this.domNode.innerHTML = JSON.stringify(_v);

},
_getValueAttr: function () {
  return '';
} ,
reset: function () {
    
} ,
isValid: function(){
	return true;
}

});
    });
