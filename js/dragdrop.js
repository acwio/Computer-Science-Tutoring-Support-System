/*
	file:			dragdrop.js
	modified by:	alex c. williams
	source:		stack overflow question concerning drag & drop
	desc:
	this file implements the ability to drag a file on top of a given element
	and fill the element with the dragged file's contents.
*/
	

if(window.FileReader) { 
 var drop; 
 addEventHandler(window, 'load', function() {
    drop   = document.getElementById('editor');

  	
    function cancel(e) {
      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }
  
    // Tells the browser that we *can* drop on this target
    addEventHandler(drop, 'dragover', cancel);
    addEventHandler(drop, 'dragenter', cancel);

addEventHandler(drop, 'drop', function (e) {
  e = e || window.event; // get window.event if e argument missing (in IE)   
  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

  var dt    = e.dataTransfer;
  var files = dt.files;
  for (var i=0; i<files.length; i++) {
    var file = files[i];
    var reader = new FileReader();
      
	 reader.onload = function(e) { 
	      var contents = e.target.result;
		 
	var editor = ace.edit("editor");
	 editor.getSession().setValue(contents);
      } 
	  
    //attach event handlers here...
   
    reader.readAsText(file);
addEventHandler(reader, 'loadend', function(e, file) {
	;	
}.bindToEventHandler(file));
  }
  return false;
});
Function.prototype.bindToEventHandler = function bindToEventHandler() {
  var handler = this;
  var boundParameters = Array.prototype.slice.call(arguments);
  //create closure
  return function(e) {
      e = e || window.event; // get window.event if e argument missing (in IE)   
      boundParameters.unshift(e);
      handler.apply(this, boundParameters);
  }
};
  });
} 

function addEventHandler(obj, evt, handler) {
    if(obj.addEventListener) {
        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {
        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {
        // Old school method.
        obj['on'+evt] = handler;
    }
}