define(["dojo/_base/declare", 
	"dijit/layout/ContentPane",
	"dojo/dom-attr", "dojo/query", "dojo/dom-class"
	], function(declare, ContentPane, domAttr,  query,  domClass) {
		return declare("PageContainer/PageContainer", [ContentPane], {

			constructor: function(args){
				dojo.safeMixin(this, args);
			},
			postCreate:function (args){
				this.inherited(arguments);

				var t = this;
				//console.debug(this.id);
				query("> *", this.domNode).forEach(function(child, i){


					if(domAttr.has(child, 'data-label')){

// TODO Aqui deberiamos insertar un contenedor para ubicar ahi los botones que se deben crear dinamicamente al crear el widget
						
					}else{

						domClass.add(child, 'PageContainerPageHide');
					}

				});
				t._showSelected();

			},
			_showSelected: function(numPage){
				var t = this;
				var ready = false;

				query("> [data-label]", this.domNode).forEach(function(child, i){

			//	console.debug(numPage, i);
			if(numPage >= 0){

				if(numPage == i){
					t._showPage(child);
				}else{
					t._hidePage(child);
				}

			}else{

				if(!ready && (domAttr.get(child, 'data-selected') == true || domAttr.get(child, 'data-selected') == "true")){
					t._showPage(child);
					ready = true;
				}else{
					t._hidePage(child);
				}

			}



		});


			},
			selectPage: function(pagePos){
				this._showSelected (pagePos);
			},
			_hidePage: function(node){
				domClass.remove(node, 'PageContainerPageShow');
				domClass.add(node, 'PageContainerPageHide');
				domAttr.set(node, 'data-selected', false);
			},
			_showPage: function(node){
				domClass.remove(node, 'PageContainerPageHide');
				domClass.add(node, 'PageContainerPageShow');
				domAttr.set(node, 'data-selected', true);
			//console.debug('Se sipone que se deberia ver la pagina '+domAttr.get(node, 'data-label'));
		}


















	}); 
	});
