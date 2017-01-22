define(['dojo/_base/declare',
    'dijit/_Widget',
    'dijit/_Templated',
    'dojo/text!Widget/menu_master/menu_master.html',
    "dojo/Evented",
    "dojo/on", "dojo/dom-class", "dojo/query", "dojo/dom-attr", "dojo/dom-style", "dojo/NodeList-fx", "dojo/fx", "dojo/_base/fx", "dojo/NodeList-traverse", "Widget/icon_svg/icon_svg"
    ], function (declare, _Widget, _Templated, templateString, Evented, on, domClass, query, domAttr, domStyle, nodeListFx, fx, baseFx) {

        return declare([_Widget, _Templated, Evented], {
            widgetsInTemplate: true,
            templateString: templateString,

            postCreate: function () {

                var t = this;
                      


                query("[data-itemclick]", t.sidebar_menu).on("click", function(ev){
                    console.debug(domAttr.get(this, "data-itemclick"));
                    t.emit('clickitem', domAttr.get(this, "data-itemclick"));
                });


                query("a", t.sidebar_menu).on("click", function(ev){


                    var li = this.parentNode;

                    if (domClass.contains(li, "active")) {

           // $li.removeClass('active');
           domClass.remove(li, "active");


           query("ul:first", li).first().style({"display": "none"});



       } else {
            // prevent closing menu if we are on child menu
            if (!domClass.contains(li.parentNode, "child_menu")) {
              query('li', t.sidebar_menu).removeClass('active');



              query('li ul', t.sidebar_menu).forEach(function(nodex){

                domStyle.set(nodex, "display", "none");

            });



          }


          domClass.add(li, 'active');

          query("ul:first", li).first().style({"display": "block"});
          





      }

  });



            },
            isVisible: function(visible){

var slideArgs = {node: this.domNode, top: (dojo.marginBox(this.domNode).t).toString(), unit: "px"};
                var widthMenu = parseInt(domStyle.getComputedStyle(this.domNode).width, 10); 

              if(visible){
                slideArgs.left = 0;
            }else{
                slideArgs.left = (dojo.marginBox(this.domNode).l - widthMenu).toString();
            }

            dojo.fx.slideTo(slideArgs).play();
        }





    });
    });
