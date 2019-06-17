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
                zoomAttr: 'data-zoom',
                locationAttr: 'data-locations',
                keepAttributes: ['class'],
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
			return function() {
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
                // latitude: 0,
                // longitude: 0,
                zoom: 0,
                removeData: function(A) {
                    var attributes = $.map(A.attributes, function(item) {
                        return item.name;
                    });
                    $.each(attributes, function(i, attr) {
                        $.each($settings.keepAttributes, function(i, keepAttr) {
                            if (attr != keepAttr && A.hasAttribute(attr)) {
                                $(A).removeAttr(attr);
                            }
                        })
                    });
                },
                createMap: function() {
                    var O = this;
                    windowScrollTop = $window.scrollTop();
                    if ($(obj).hasClass('loaded'))
                        return true;
                    if($(obj).offset().top - windowScrollTop > windowHeight * 1)
                        return true;
                    if( !apiScriptLoaded && !apiScriptLoading ) {
                        $body.append( '<script async defer src="https://maps.googleapis.com/maps/api/js?key=' + $settings.apiKey + '&callback=gmapScriptLoaded&language=' + $settings.culture + '"></script>' );
                        apiScriptLoading = true;
                    }
                    if( !apiScriptLoaded ) return true;
                    O.zoom = parseInt($(obj).attr($settings.zoomAttr));

                    var settingsToParse = $(obj).attr($settings.locationAttr).split("], ");
                    var index = 0;
                    var values = [];
                    settingsToParse.forEach(function(el) {
                        if ((index + 1) < settingsToParse.length) {
                            el = el + "]";
                        }
                        values[index] = JSON.parse(el);
                        index++;
                    });

                    var position = new google.maps.LatLng(values[0][0], values[0][1]);
                    var map = new google.maps.Map(obj, {
                        center: position,
                        zoom: O.zoom
                    });

                    values.forEach(function(val) {
                        var tmp = new google.maps.Marker({
                            position: new google.maps.LatLng(val[0], val[1]),
                            map: map,
                            animation: google.maps.Animation.DROP,
                            icon: ''  
                        }); 
                    });
                    
                    O.removeData(obj);
                    $(obj).addClass("loaded");
                },
                listen: function() {
                    var O = this;
                    $window
                    .on('gmapScriptLoaded', function() {
                        apiScriptLoaded = true;
                        O.createMap();
                    })
                    .on('load scroll', throttle(250, O.createMap ))
                    .on('resize', debounce(250, function() {
                        windowHeight = $window.height();
                        O.createMap();
                    }))
                }
            }
            obj.lazymap.listen();
        })
        return ret.length === 1 ? ret[0] : ret;
    }
})(jQuery, window, document);