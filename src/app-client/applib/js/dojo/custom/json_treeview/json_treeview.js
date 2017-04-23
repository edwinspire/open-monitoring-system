define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/json_treeview/json_treeview.html',
    "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel", "dijit/Tree", "dojo/store/Observable", "dijit/tree/ForestStoreModel", "dojo/data/ItemFileReadStore"
    ], function (declare, _Widget, _Templated, templateString, Memory, ObjectStoreModel, Tree, Observable, ForestStoreModel, ItemFileReadStore) {

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


/*
for(var index in _v) { 
    var attr = _v[index]; 
      console.log(attr, index);
     datajson.push( { id: 'world', name: index});
     datajson.push({ id: 'AF', name: attr, parent: 'world'});
}
*/
/*

    myStore = new Memory({
        data: [
        { id: 'world', name:'The earth', type:'planet', population: '6 billion'},
        { id: 'AF', name:'Africa', type:'continent', population:'900 million', area: '30,221,532 sq km',
                timezone: '-1 UTC to +4 UTC', parent: 'world'},
            { id: 'EG', name:'Egypt', type:'country', parent: 'AF' },
            { id: 'KE', name:'Kenya', type:'country', parent: 'AF' },
                { id: 'Nairobi', name:'Nairobi', type:'city', parent: 'KE' },
                { id: 'Mombasa', name:'Mombasa', type:'city', parent: 'KE' },
            { id: 'SD', name:'Sudan', type:'country', parent: 'AF' },
                { id: 'Khartoum', name:'Khartoum', type:'city', parent: 'SD' },
        { id: 'AS', name:'Asia', type:'continent', parent: 'world' },
            { id: 'CN', name:'China', type:'country', parent: 'AS' },
            { id: 'IN', name:'India', type:'country', parent: 'AS' },
            { id: 'RU', name:'Russia', type:'country', parent: 'AS' },
            { id: 'MN', name:'Mongolia', type:'country', parent: 'AS' },
        { id: 'OC', name:'Oceania', type:'continent', population:'21 million', parent: 'world'},
        { id: 'EU', name:'Europe', type:'continent', parent: 'world' },
            { id: 'DE', name:'Germany', type:'country', parent: 'EU' },
            { id: 'FR', name:'France', type:'country', parent: 'EU' },
            { id: 'ES', name:'Spain', type:'country', parent: 'EU' },
            { id: 'IT', name:'Italy', type:'country', parent: 'EU' },
        { id: 'NA', name:'North America', type:'continent', parent: 'world' },
        { id: 'SA', name:'South America', type:'continent', parent: 'world' }
        ],
        getChildren: function(object){
            // Supply a getChildren() method to store for the data model where
            // children objects point to their parent (aka relational model)
            return this.query({parent: object.id});
        }
    });
    myStore = new Observable(myStore);
    // Create the model
    var myModel = new ObjectStoreModel({
        store: myStore,
        query: {id: 'world'}
    });

    // Create the Tree.
    var tree = new Tree({
        model: myModel,
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

*/
this.domNode.innerHTML = JSON.stringify(_v);

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
