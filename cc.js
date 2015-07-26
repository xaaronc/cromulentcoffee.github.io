

var map;

function geo_loaded(result)
{
    // Load a GeoJSON from the same server as our demo.

    console.log("loading geo")
    
    map.data.addGeoJson(result)

    map.data.setStyle(style_feature);
}

function style_feature(feature)
{
	var name = feature.getProperty('name');
	var rating = feature.getProperty('rating');

	switch(rating) {
	case "cromulent":
		icon = "red-dot.png"
		break;
	case "insta-find":
		icon = "blue-dot.png"
		break;
	case "unverified":
	default:
		icon = "grey-dot.png"	
	}

	return {
	clickable: true,
			title: name,
			icon: icon

			};
}

// manage click events
infoWindow = new google.maps.InfoWindow({
    content: ""
});

function click_event(event)
{
    //show an infowindow on click   
    // infoWindow.setContent('<div style="line-height:1.35;overflow:hidden;white-space:nowrap;"> <br/>' + event.feature.getProperty("name") + "</div>");

	info = '<div style="font-size: 16;"><b>' + event.feature.getProperty("name") + "</b></div>";

	if (typeof event.feature.getProperty('location') != 'undefined')
		info += '<div style="font-size: 12;"><b>' + event.feature.getProperty("location") + "</b></div>";

	info += '<div style="font-size: 12; color = #CCC;">';
	info += event.feature.getProperty("rating");
	info += '</div>';

	info += '<div style="font-size: 12;">';
	if (typeof event.feature.getProperty('food') != 'undefined')
		info += "<br />food: " + event.feature.getProperty("food");
	if (typeof event.feature.getProperty('notes') != 'undefined')
		info += "<br />" + event.feature.getProperty("notes");
	info += '</div>';

	info += '<br />';

	info += '<div style="float: center; vertical-align: middle;">';

	if (typeof event.feature.getProperty('url') != 'undefined')
		info += "<a href=" + event.feature.getProperty("url") + '><img src="home.png" /></a>';

	if (typeof event.feature.getProperty('yelp') != 'undefined')
		info += "<a href=" + event.feature.getProperty("yelp") + '><img src="yelp.png" /></a>';

	if (typeof event.feature.getProperty('ig') != 'undefined')
		info += '<a href="http://instagram.com/' + event.feature.getProperty("ig") + '?ref=badge"><img src="http://badges.instagram.com/static/images/ig-badge-24.png" alt="Instagram" /></a>';

	if (typeof event.feature.getProperty('twitter') != 'undefined')
		info += '<a href="http://twitter.com/' + event.feature.getProperty("twitter") + '"><img src="twitter.png" alt="Twitter" /></a>';

	var lllit = event.feature.getGeometry().get();
	qstr = lllit.lat() + "," + lllit.lng();
	
	info += '<a href="http://maps.google.com/?q=' + qstr + '"><img src="maps.png" alt="Maps" /></a>';
	info += "</div>";
    
	infoWindow.setContent(info);
    
	var anchor = new google.maps.MVCObject();
	anchor.set("position",event.latLng);
	anchor.set("anchorPoint", new google.maps.Point(0,-40));
	infoWindow.open(map,anchor);
}


// functions to handle setting locations
var mapOptionsSF = {
    center: new google.maps.LatLng(37.7933, -122.4167),
    zoom: 12
}

function map_align_sf()
{
    console.log("align sf");
    map.panTo(mapOptionsSF['center']);
    map.setZoom(mapOptionsSF['zoom']);
}

function map_align_ca()
{
    console.log("align ca");
    map.panTo(new google.maps.LatLng(37.7833, -122.4167));
    map.setZoom(6);
}

function map_align_world()
{
    map.panTo(new google.maps.LatLng(0,0));
    map.setZoom(2);
}

function maps_init()
{
    var mapCanvas = document.getElementById('map-canvas');

    map = new google.maps.Map(mapCanvas, mapOptionsSF);

    //listen for click events
    map.data.addListener('click', click_event);

    console.log("geting json");
    jQuery.getJSON("ccgeo.json", "", geo_loaded);
    console.log("got json");

}

function cc_init()
{
    maps_init();

    // Hook the location links
    document.getElementById('map-sf').addEventListener('click',
						       map_align_sf, false);
    document.getElementById('map-ca').addEventListener('click',
						       map_align_ca, false);
    document.getElementById('map-world').addEventListener('click',
							  map_align_world, false);
}

// Predicate everything on the load even
google.maps.event.addDomListener(window, 'load', cc_init);

