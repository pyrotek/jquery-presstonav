// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "pressToNav",
				defaults = {
				propertyName: "value"
		};

		// The actual plugin constructor
		function pressToNav ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(pressToNav.prototype, {
				init: function () {
						if (detectTouchScreen() == true/* && $(window).width() > 768*/) {
					        // remove all link suppression
					        $('.dropdown > a,.dropdown-submenu > a').unbind('click').click(function(event){ return true; });
					        $('.dropdown,.dropdown-submenu').hover(function(){
					            $(this).children('ul').stop(true, true).fadeIn(700);
					        }, function(){
					            $(this).children('ul').stop(true, true).fadeOut(500);
					        });
					        return false;
					    }
					    // Narrow window, turn on click nav:
					    else if (clickNavToggled == false/* && $(window).width() <= 768*/) {
					        $('.dropdown,.dropdown-submenu').unbind('mouseenter mouseleave').children('a').click(function(event){
					            menuNavigate(event,$(this));
					        });
					        return true;
					    }
					    return clickNavToggled;
				},
				menuNavigate: function () {
				    // suppress link
				    e.preventDefault();
				    // hide open links
				    targetLink.parent().siblings('.dropdown-submenu').children('ul').fadeOut(500).siblings('a').unbind('click').click(function(event){ menuNavigate(event,$(this)); });
				    targetLink.siblings('ul').stop(true, true).fadeIn(700,function(){
				        // close last opened link and replace click nav function
				        $('html').click(function(){
				            $(this).unbind('click');
				            targetLink.siblings('ul').stop(true, true).fadeOut(500);
				            targetLink.unbind('click').click(function(event){ menuNavigate(event,targetLink); });
				        });
				        targetLink.siblings('ul').click(function(event){
				            event.stopPropagation();
				        });
				    });
				    // Restore default functionality on second click
				    targetLink.unbind('click').click(function(event){ return true; });
				},
				detectTouchScreen: function () {
					return 'ontouchstart' in window // works on most browsers
					      || 'onmsgesturechange' in window; // works on ie10					
				}
			});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );
