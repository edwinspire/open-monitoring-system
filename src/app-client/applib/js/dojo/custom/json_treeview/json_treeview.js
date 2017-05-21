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
  console.log(_v);

     var t = this;
var datajson = [];
var i = 1;

 datajson.push({ id: 0, name:'root'});

for(var index in _v) { 
    var attr = _v[index]; 
      console.log(attr, index);
     datajson.push( { id: i, name: index, parent: 0});
     datajson.push({ id: i+1, name: attr, parent: i});
     i++;
}


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
         showRoot: false,
        getIconClass: function(item, opened) {
            console.log(item);
            if (item.type == "country") {
                return "dijitLeaf";
            } else if (item.launched) {
                return (opened ? "dijitFolderOpened" : "dijitFolderClosed");
            } else {
                return (opened ? "dijitFolderOpened" : "dijitFolderClosed");
            }
        }
    });
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
