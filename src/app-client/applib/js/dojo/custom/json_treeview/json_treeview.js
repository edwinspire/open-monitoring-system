define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/json_treeview/json_treeview.html',
    "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel", "dijit/Tree", "dojo/_base/array"
    ], function (declare, _Widget, _Templated, templateString, Memory, ObjectStoreModel, Tree, array) {

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

datajson.push({ id: "0", name:'Event'});


function LoopObject (obj, parent){
    var objects = [];


    if(Array.isArray(obj)){


        array.forEach(obj, function(item, index){
            objects = objects.concat(LoopObject (item, parent));
        });

    }else{

        var i = Math.floor(Math.random() * 1000);
        for(var property in obj) { 
            var id = parent+'__'+i;
            var v = obj[property]; 

            objects.push({ id: id, name: property, parent: parent});

            if(typeof v == 'object'){
              objects = objects.concat(LoopObject (v, id));
          }else if(typeof v == 'string' || typeof v == 'number' || typeof v == 'boolean'){
            objects.push({ id: id+'_', name: v, parent: id, type: 'value'});

        }


        i++;
    }

}


return objects;
}


datajson = datajson.concat(LoopObject (_v, "0"));

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
        query: {id: "0"}
    });

    // Create the Tree.
    var tree = new Tree({
        model: myModel,
        autoExpand: false,
        openOnClick: true,
        showRoot: true,
        getIconClass: function(item, opened) {
          //  console.log(item);
          if (item.type == "value") {
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
