# Lazymap
Simply loads any maps created with Google Maps API when it comes visibile in the viewport.
You can check when the map loads by going into the Developer tools inside your browser, search for the Network tab and reload the page.

## Basic usage
As basic HTML:
````html
<div class="map" data-lat="%YOURLATITUDE%" data-lng="%YOURLONGITUDE%" data-zoom="%YOURZOOM%"></div>
````

Include jQuery and lazymap:
````html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="your/javascript/folder/jquery.lazymap.js"></script>
````

And then simply call lazymap after jquery:
````javascript
    $('.map').lazymap({
        apiKey: '',
        culture: 'it'
    });
````

This can works for as many maps as you want!!