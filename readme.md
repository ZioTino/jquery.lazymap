Watch the preview of this plugin here: https://ziotino.github.io/jquery.lazymap/

# Lazymap
Simply loads any maps created with Google Maps API when it comes visibile in the viewport.
You can check when the map loads by going into the Developer tools inside your browser, search for the Network tab and reload the page.

## Basic usage
As basic HTML:
````html
<div class="map" data-locations="[%YourLatitude%, %YourLongitude%]" data-zoom="%YourZoom%"></div>
````

Include jQuery and lazymap:
````html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="your/javascript/folder/jquery.lazymap.js"></script>
````

And then simply call lazymap after jquery:
````javascript
$('.map').lazymap({
    apiKey: '%YourAPIKeyGoesHere%'
});
````

### How *data-locations* works?
*data-locations* is an HTML attribute that receives an array of arrays. For example:
````html
<div class="map" data-locations="[%Marker1Values%], [%Marker2Values%], [%Marker3Values%]"></div>
````
where every *%Marker1Values%* has as first value the **Latitude**, and as second value the **Longidude** of the marker you want to set.

## Additional options:
* ***Override* the map's language** that anyway gets the browser's language as default: `culture` (*string*);
* **Change the default html attributes** with:
    * `locationAttr` *(string[])*: lets you change the default attribute for map's latitude and longitude,
    * `zoomAttr` *(string)*: lets you change the default attribute for map's zoom;
* **Add an attribute to whitelist**, preventing it to be deleted when the map is initialized: `keepAttributes` *( string[] )*;

This can works for as many maps as you want!!