'use strict';
window.gmapScriptLoaded = function(){
	$(window).trigger('gmapScriptLoaded');
};
(function($, window){
    'namespace lazymap';
    $.fn.lazymap = function(options) {
        // Options
        var $window = $(window),
            $body = $('body'),
            windowHeight = $window.height(),
            windowScrollTop	= 0,
            apiScriptLoaded = false,
            apiScriptLoading = false;

        // User settings
        var $settings = $.extend({
            //selector: '.map', // Ideally the selector is a class, 'cause we could iterate on it
            latituteAttribute: 'data-lat',
            longitudeAttribute: 'data-lng',
            zoomAttribute: 'data-zoom',
            apiKey: '',
            culture: '' // Supported language code according to https://developers.google.com/maps/faq#languagesupport
        }, options);

        // Functions
        function debounce (delay, fn) {
            var timer = null;
			return function() {
                var context = this,
                    args = arguments;
				clearTimeout(timer);
				timer = setTimeout( function(){ fn.apply( context, args ); }, delay );
			};
        }
        function throttle (delay, fn) {
            var last,
                deferTimer;
			return function()
			{
                var context = this,
                    args = arguments,
                    now = +new Date;
				if( last && now < last + delay )
				{
					clearTimeout(deferTimer);
					deferTimer = setTimeout( function(){ last = now; fn.apply( context, args ); }, delay );
				}
				else
				{
					last = now;
					fn.apply( context, args );
				}
			};
        }

        // Map init
        var ret = this.each(function() {
            var obj = this; // Original object where all the settings are located via data attribute
            if (this.lazymap || !$(this).hasClass('map')) return; // If it's not the correct element, return nothing.
            
            this.lazymap = {
                latitude: 0,
                longitude: 0,
                zoom: 0,
                createMap: function() {
                    var O = this;
                    windowScrollTop = $window.scrollTop();

                    if ($(obj).hasClass('initialized'))
                        return true;
                    
                    // The map is already present on the viewport, no need to go further
                    if($(obj).offset().top - windowScrollTop > windowHeight * 1)
                        return true;
                        
                    // Check if Api script has already been placed, otherwise place it
                    if( !apiScriptLoaded && !apiScriptLoading ) {
                        $body.append( '<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + $settings.apiKey + '&callback=gmapScriptLoaded&language=' + $settings.culture + '"></script>' );
                        apiScriptLoading = true;
                    }

                    // Stop if the script has not been placed in some cases
                    if( !apiScriptLoaded ) return true;

                    // Gets the data from the object
                    O.latitude = parseFloat($(obj).attr($settings.latituteAttribute));
                    O.longitude = parseFloat($(obj).attr($settings.longitudeAttribute));
                    O.zoom = parseInt($(obj).attr($settings.zoomAttribute));
                    // FEATURE: Add the possibility to style the map (i.e. with https://snazzymaps.com/)
                    var position = new google.maps.LatLng(O.latitude, O.longitude);
                    // var position = new google.maps.LatLng(41.898743, 12.498862);
                    //var position = {lat: 41.898743, lng: 12.498862};
                    var map = new google.maps.Map(obj, {
                        center: position,
                        zoom: O.zoom
                    });
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        animation: google.maps.Animation.DROP
                    });
                    $(obj).addClass('initialized');
                    
                    // FEATURE: Add the possibility to set multiple markers
                    // FEATURE: Add the possibility to change the marker image
                    // FEATURE: Add the possibility to link the marker to a function or a link
                },
                listen: function() {
                    var O = this;
                    $window
                    .on('gmapScriptLoaded', function() {
                        apiScriptLoaded = true;
                        O.createMap();
                    })
                    .on('scroll', throttle(250, O.createMap ))
                    .on('resize', debounce(250, function() {
                        windowHeight = $window.height();
                        O.createMap();
                    }))
                    .on('load', function() {
                        $window.trigger('scroll');
                    })
                },
                init: function() {
                    var O = this;
                    O.listen();
                    return O;
                }
            }

            obj.lazymap.init();
        })

        return ret.length === 1 ? ret[0] : ret;
    }
})(jQuery, window, document);