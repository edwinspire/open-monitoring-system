	require(["dojo/ready", "dojo/on", "dojo/dom-class", "dojo/_base/window", "dojo/query", "dojo/dom-attr", "dojo/dom-style", "dojo/NodeList-fx", "dojo/fx", "dojo/_base/fx", "dojo/NodeList-traverse", "dojo/NodeList-dom"], function(ready, on, domClass, win, query, domAttr, domStyle, nodeListFx, fx, baseFx){
     ready(function(){



/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('?')[0];
    
    var BODY = win.body();
    var MENU_TOGGLE = dojo.byId('menu_toggle');
     var SIDEBAR_MENU = dojo.byId('sidebar-menu');
      var RIGHT_COL = dojo.byId('PageContent');
       var LEFT_COL = dojo.byId('menu_left_col');
         var NAV_MENU = dojo.byId('nav_menu_id');
          var SIDEBAR_FOOTER = dojo.byId('sidebar-footer_id');
          var FOOTER = dojo.byId('footer_id');
       
    
// Sidebar
    var setContentHeight = function () {
//console.log(dojo.window.getBox(), domStyle.get(BODY, 'height'));
            domStyle.set(RIGHT_COL, 'min-height', dojo.window.getBox().h+'px');
 //   dijit.byId('ViewContent').resize({h: dojo.window.getBox().h-domStyle.get(NAV_MENU, 'height')});        
    };



/*
query('li.a', SIDEBAR_MENU).on('click', function(e){
//console.log();
var li = e.target;

if(domClass.contains(li, "active")){

 domClass.remove(li, "active");
//TODO: Esta parte de codigo debemos cambiarla a dojo
              $('ul:first', li).slideUp(function() {
                setContentHeight();
            });

}else{

            // prevent closing menu if we are on child menu
if(domClass.contains(li.parentNode, ".child_menu")){
//TODO: Ver como simplificar la eliminacion de la clase con query
query('li', SIDEBAR_MENU).forEach(function(node){
 domClass.remove(node, "active");
});
// TODO Reemplezar esto por una funcion de dojo
                $SIDEBAR_MENU.find('li ul').slideUp();
            }
            
domClass.add(li, "active");

//TODO: Reemplazar esta funcion por una de dojo
            $('ul:first', li).slideDown(function() {
                setContentHeight();
            })


}


});
*/


query("a", SIDEBAR_MENU).on("click", function(ev){


        var li = this.parentNode;

        if (domClass.contains(li, "active")) {
        
           // $li.removeClass('active');
             domClass.remove(li, "active");
          
           /*
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
            
            */
            
                        
                        query("ul:first", li).first().style({"display": "none"});
                        setContentHeight();
                     
            
                        
            
            
        } else {
            // prevent closing menu if we are on child menu
            if (!domClass.contains(li.parentNode, "child_menu")) {
                //$SIDEBAR_MENU.find('li').removeClass('active');
                query('li', SIDEBAR_MENU).removeClass('active');
                
              // $SIDEBAR_MENU.find('li ul').slideUp();
                 
                
                                        query('li ul', SIDEBAR_MENU).forEach(function(nodex){

    domStyle.set(nodex, "display", "none");

                        });
                        
                        
                        
            }
            
            //$li.addClass('active');
            domClass.add(li, 'active');
                                            
query("ul:first", li).first().style({"display": "block"});
                        setContentHeight();
                        
                        
                        
              
            
        }

});



/*
    $SIDEBAR_MENU.find('a').on('click', function(ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }
            
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

*/

on(MENU_TOGGLE, 'click', function(){
if (domClass.contains(BODY, "nav-md")){
    
    domClass.remove(BODY, "nav-md");
         domClass.add(BODY, "nav-sm");
    
 query("li.active", SIDEBAR_MENU).forEach(function(node){
         domClass.add(BODY, "active-sm"); 
  domClass.remove(BODY, "active");
 });
    
    }else{
    
    domClass.remove(BODY, "nav-sm");
             domClass.add(BODY, "nav-md");
    
 query("li.active-sm", SIDEBAR_MENU).forEach(function(node){
         domClass.add(BODY, "active"); 
  domClass.remove(BODY, "active-sm");
 });
    
    }

 setContentHeight();
});



/*
    // recompute content when resizing
    $(window).smartresize(function(){  
        setContentHeight();
    });
    
    */
    
/*
    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel:{ preventDefault: true }
        });
    }
    */

// /Sidebar


/*
// Panel toolbox
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
// /Panel toolbox
*/
       

/*
//    <!-- Autosize -->
      $(document).ready(function() {
        autosize($('.resizable_textarea'));
      });
//    <!-- /Autosize -->
*/

setContentHeight();





 
     
     

     });
});


