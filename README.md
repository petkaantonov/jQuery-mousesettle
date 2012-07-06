###Intro###

jQuery mousesettle is like [hoverIntent](http://cherne.net/brian/resources/jquery.hoverIntent.html) but instead of providing
a method, it adds 2 events (`"mousesettle"` and `"mouseunsettle"`) you can use with jQuery.

The advantage of using events is that you can use event delegation

###Usage###

	$(elem).on("mousesettle", function() {
		//mouse has "settled" on the element, I.E hover was intended
	});
	

	$(elem).on("mousesettle", ".niceclass", function() {
		//mouse has "settled" on the child element of elem with class .niceclass, I.E hover was intended but with delegation
	});	
	
Delegate with different handlers:
	
	$(elem).on({
		mousesettle: function() {
			
		},
		mouseunsettle: function() {
		
		}
	}, ".niceclass" );
	
###Config###

    $.MouseSettle.settlingTimeout = 650; 
      
 The mouse needs to be still or sufficiently slowed down this amount of milliseconds on the element for it to be considered
 settled.
 
    $.MouseSettle.speedThreshold = 150;

Mouse moving slower than this speed is considered sufficiently slowed down.

[Demo](http://jsfiddle.net/9RfMx/1/)

