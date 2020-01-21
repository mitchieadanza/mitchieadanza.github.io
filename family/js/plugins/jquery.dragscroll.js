/*
 * Drag Scroll
 *
 * References:
 * Paul Irish
 */
window.dragScroll=function(o){var l,r,c=$.extend({scrollVertical:!0,scrollHorizontal:!0,cursor:null},o),s=!1,e=function(o,s){$("html").css("cursor",c.cursor?c.cursor:c.scrollVertical&&c.scrollHorizontal?"move":c.scrollVertical?"row-resize":c.scrollHorizontal?"col-resize":void 0);var e=$(s);c.scrollVertical&&e.scrollTop(e.scrollTop()+(l-o.pageY)),c.scrollHorizontal&&e.scrollLeft(e.scrollLeft()+(r-o.pageX))};$(document).on({mousemove:function(o){s&&e(o,this)},mousedown:function(o){s=!0,l=o.pageY,r=o.pageX},mouseup:function(){s=!1,$("html").css("cursor","auto")}})};