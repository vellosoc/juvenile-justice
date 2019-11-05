
//This function joins the two data sources into one where county_nam matches
paCountyData.features.map(res => Object.assign(res, {
properties: {
    ...res.properties,
    ...data2[res.properties.county_nam]
}
}))


//Create a variable called mymap that binds to the id "mapid" in html
var mymap = L.map('mapid', { zoomControl: false }).setView([40.798511, -77.724825], 7);

//call mapbox map with my access token
// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//    maxZoom: 18,
//    id: 'mapbox.light',
//    accessToken: 'pk.eyJ1IjoiYW1hcnRvbiIsImEiOiJjajgzdDFrdTcwMXIwMzJubmthd25jY3V2In0.01j1w1cZs1S7b7a4tiMvfg'
// }).addTo(mymap);

//this adds the basic goemetry to the map
L.geoJson(paCountyData).addTo(mymap);

//select the color ramp
function getColor(d) {
    return d == 0 ? '#cdcdcd' : //this is the color where the total equals zero
           d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

//select which data value to create the color ramp based on -- in this case total
function style(feature) {

    return {
        fillColor: getColor(feature.properties.total),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };

}


// Create a function to display the data on the page -- not in a popup
function onEachFeature(feature, layer) {

  // This is for the counties with no resentancing. If total = 0, do this
  if (feature.properties.total == 0){

    layer.on('click', function(e) {
      $(".county_nam").html(feature.properties.county_nam + " COUNTY");
      $(".total").html("<span id=\"number\"><strong>" + feature.properties.total + "</strong></span></br> juvenile lifers");
      $(".total_resentanced").html("");
      $(".released").html("");
      $(".resentanced_nonlife").html("");
      $(".given_life").html("");
      $(".waiting_resentance").html("");
      $(".total_minority").html("");
      $(".total_white").html("");
      $(".races").html("");

    });

  // This is for the counties with resentancing values
  } else

  layer.on('click', function(e) {
    $(".county_nam").html(feature.properties.county_nam + " COUNTY");
    $(".total").html("<span id=\"number\"><strong>" + feature.properties.total + "</strong></span></br> total juvenile lifers");
    $(".total_resentanced").html("<span id=\"number\"><strong>" + feature.properties.total_resentanced + "</strong></span></br> total resentanced");
    $(".released").html("<span id=\"smallnumber\"><strong>" + feature.properties.released + "</strong></span> <span class=\"highlight\">released</span> since 2016");
    $(".resentanced_nonlife").html("<span id=\"smallnumber\"><strong>" + feature.properties.resentanced_nonlife + "</strong></span>  resentenced to <span class=\"highlight\">non-life terms</span>");
    $(".given_life").html("<span id=\"smallnumber\"><strong>" + feature.properties.given_life + "</strong></span> given <span class=\"highlight\">life without parole</span> again");
    $(".waiting_resentance").html("<span id=\"smallnumber\"><strong>" + feature.properties.waiting_resentance + "</strong></span> still waiting for their <span class=\"highlight\">resentencing</span>");
    $(".total_minority").html("<span id=\"percentage\"><strong>" + feature.properties.total_minority + "%</strong></span> are <span class=\"highlight\">minorities</span><span class=\"asterisk\">*</span>");
    $(".total_white").html("<span id=\"percentage\"><strong>" + feature.properties.total_white + "%</strong></span> are <span class=\"highlight\">white</span>")
    $(".races").html("*Minorities include those who are black, Hispanic or Asian.")
  });

}


//Add the color ramps and popup to the selected initial feature
var geojsonLayer = new L.geoJson(paCountyData, {onEachFeature: onEachFeature, style: style});

geojsonLayer.addTo(mymap);
