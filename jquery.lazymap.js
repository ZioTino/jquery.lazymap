'use strict';
window.gmapScriptLoaded = function(){
	$(window).trigger('gmapScriptLoaded');
};
(function($, window){
    'namespace lazymap';
    $.fn.lazymap = function(options) {
        var $window = $(window),
            $body = $('body'),
            windowHeight = $window.height(),
            windowScrollTop	= 0,
            apiScriptLoaded = false,
            apiScriptLoading = false,
            $settings = $.extend({
                latituteAttribute: 'data-lat',
                longitudeAttribute: 'data-lng',
                zoomAttribute: 'data-zoom',
                apiKey: '',
                culture: ''
            }, options);
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
        var ret = this.each(function() {
            var obj = this;
            if (this.lazymap || !$(this).hasClass('map')) return;
            obj.lazymap = {
                latitude: 0,
                longitude: 0,
                zoom: 0,
                createMap: function() {
                    var O = this;
                    windowScrollTop = $window.scrollTop();
                    if ($(obj).hasClass('initialized'))
                        return true;
                    if($(obj).offset().top - windowScrollTop > windowHeight * 1)
                        return true;
                    if( !apiScriptLoaded && !apiScriptLoading ) {
                        $body.append( '<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + $settings.apiKey + '&callback=gmapScriptLoaded&language=' + $settings.culture + '"></script>' );
                        apiScriptLoading = true;
                    }
                    if( !apiScriptLoaded ) return true;
                    O.latitude = parseFloat($(obj).attr($settings.latituteAttribute));
                    O.longitude = parseFloat($(obj).attr($settings.longitudeAttribute));
                    O.zoom = parseInt($(obj).attr($settings.zoomAttribute));
                    var position = new google.maps.LatLng(O.latitude, O.longitude);
                    var map = new google.maps.Map(obj, {
                        center: position,
                        zoom: O.zoom
                    });
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: ''  
                    });
                    $(obj).addClass('initialized');
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
                }
            }
            obj.lazymap.listen();
        })
        return ret.length === 1 ? ret[0] : ret;
    }
})(jQuery, window, document);