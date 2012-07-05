/*
Copyright (c) 2012 Petka Antonov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:</p>

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


Based on http://cherne.net/brian/resources/jquery.hoverIntent.js
*/

(function (window, Math, $, undef) {

    $.MouseSettle = MouseSettle;
    
    MouseSettle.settlingTimeout = 650;
    MouseSettle.speedThreshold = 150;

    function MouseSettle( elem, event, handler ) {
        this.elem = elem;
        this.event = event;
        this.handler = handler;
        
        this.mousemove = $.proxy( this.mousemove, this );
        this.poller = $.proxy( this.poller, this );
        this.settled = $.proxy( this.settled, this );
        
        this.throttleId = window.setTimeout( this.settled, MouseSettle.settlingTimeout );
        this.pollerId = window.setInterval( this.poller, 20 );
        
        $( elem ).bind( "mousemove.mousesettle", this.mousemove );
        
        this.cur = {};
        this.prev = {};
        this.lastPoll = +new Date;
        this.isSettled = false;
        
    }

    MouseSettle.prototype = {
    
        pollerId: 0,
        
        speedId: 0,
        
        throttleId: 0,
        

        
        poller: function() {
            var cur = this.cur,
                prev = this.prev,
                now = +new Date,
                
                checkSpeedInterval = now - this.lastPoll;
                
            this.lastPoll = now;    
                
            if (prev.x !== undef && prev.y !== undef) {
                var speed = (Math.sqrt(Math.pow(prev.x - cur.x, 2) + Math.pow(prev.y - cur.y, 2)) / checkSpeedInterval ) * 1000;
                if (speed <= MouseSettle.speedThreshold && !this.throttleId) {
                    this.throttleId = window.setTimeout( this.settled, MouseSettle.settlingTimeout );
                }
                if( speed > MouseSettle.speedThreshold ){
                    window.clearTimeout( this.throttleId );
                    this.throttleId = 0;
                }
            }
            prev.x = cur.x;
            prev.y = cur.y;        
        
        },
        
        settled: function() {
            if( this.isSettled ) {
                return;
            }
            this.isSettled = true;
            var event = this.event;                
            event.type = "mousesettle";
            this.handler.call( this.elem, event );
                
        },
        
        mousemove: function(e) {
            this.cur.x = e.pageX;
            this.cur.y = e.pageY;
        },
        
        destroy: function() {
            window.clearInterval( this.pollerId );
            window.clearTimeout( this.throttleId );

            $( this.elem ).unbind( "mousemove.mousesettle" );
            $( this.elem ).removeData( "mouseSettleInstance" );
        },

        constructor: MouseSettle
    };
    
    $.each({mousesettle: "mouseenter",
     mouseunsettle: "mouseleave"}, function( complex, simple ) {

        jQuery.event.special[complex] = {

            setup: function( data ) {
                return true;
            },
            
            teardown: function() {
                return true;
            },
            
            remove: function( obj ) {
                if( !obj.settleHandler ) {
                    return;
                }
                if( obj.selector ) {
                    $( this ).undelegate( obj.selector, simple+".mousesettle", obj.settleHandler );
                }
                else {
                    $( this ).unbind( simple+".mousesettle", obj.settleHandler );
                }
                
            },
            
            add: function( obj ) {
                obj.settleHandler = handles[complex](obj.handler);
                if( obj.selector ) {
                    
                    $( this ).delegate( obj.selector, simple+".mousesettle", obj.data, obj.settleHandler );
                }
                else {
                    $( this ).bind( simple+".mousesettle", obj.data, obj.settleHandler  );
                }
               
            }
        };
    
    });
    
    var handles = {
        mousesettle: function(handler) {
            return function(event) {
                $( this ).data( "mouseSettleInstance", new MouseSettle( this, event, handler ) );
            };
        },
        
        mouseunsettle: function(handler) {
            return function(event) {
                var instance = $( this ).data( "mouseSettleInstance" );
                if( instance && ( instance = Object( instance ) ) && instance instanceof MouseSettle ) {
                    instance.destroy();
                    if( instance.isSettled ) {
                        event.type = "mouseunsettle";
                        handler.call( this, event );
                    }
                }

            };
            
        }
    }

}(this, this.Math, this.jQuery));



