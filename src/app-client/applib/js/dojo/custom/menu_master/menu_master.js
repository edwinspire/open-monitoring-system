define(['dojo/_base/declare',
  'dijit/_Widget',
  'dijit/_Templated',
  'dojo/text!Widget/menu_master/menu_master.html',
  "dojo/Evented",
  "dojo/on", "dojo/dom-class", "dojo/query", "dojo/dom-attr", "dojo/dom-style", "dojo/NodeList-fx", "dojo/fx", "dojo/_base/fx", "dojo/NodeList-traverse", "Widget/icon_svg/icon_svg", "dijit/layout/AccordionContainer", "dijit/layout/ContentPane",  "dijit/TitlePane", "dijit/form/Button",
  "dijit/MenuSeparator"
  ], function (declare, _Widget, _Templated, templateString, Evented, on, domClass, query, domAttr, domStyle, nodeListFx, fx, baseFx) {

    return declare([_Widget, _Templated, Evented], {
      widgetsInTemplate: true,
      templateString: templateString,
      _visible: true,
      postCreate: function () {

        var t = this;



        query("[data-itemclick]", t.domNode).on("click", function(ev){
          console.debug(domAttr.get(this, "data-itemclick"));
          t.emit('clickitem', domAttr.get(this, "data-itemclick"));
        });

        t.isVisible(true);

      },
      isVisible: function(visible){
        var t = this;
        t._visible = visible;
        var slideArgs = {node: this.domNode, top: (dojo.marginBox(this.domNode).t).toString(), unit: "px"};
        var widthMenu = parseInt(domStyle.getComputedStyle(this.domNode).width, 10); 

        if(visible){
          slideArgs.left = 0;
        }else{
          slideArgs.left = (dojo.marginBox(this.domNode).l - widthMenu).toString();
        }

        dojo.fx.slideTo(slideArgs).play();
      },
      toggle: function(){
        this.isVisible(!this._visible);
      }





    });
  });
