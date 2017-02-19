define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!Widget/dGridWidget/dGridWidget.html',
  "dojo/Evented",
  "dojo/topic",
  'dstore/Memory',
  'dstore/Trackable'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString   
});
});