
// Part 1 of Project Completed


let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log('logic.js file accessed')

// Console logs for reference
d3.json(link).then(function (data) {
  console.log(data)
  console.log(data.features[0].geometry.coordinates)

  let lats = []
  let lons = []
  let mags = []
  let depths = []
  for (let i = 0; i < Object.keys(data.features).length; i++) {
    lats.push(data.features[i].geometry.coordinates[0])
    lons.push(data.features[i].geometry.coordinates[1])
    depths.push(data.features[i].geometry.coordinates[2])
    mags.push(data.features[i].properties.mag)
  }
  console.log(lats)
  console.log(lons)
  console.log(depths)
  console.log('mags', mags)

  let minMag = Math.min(...mags)
  let maxMag = Math.max(...mags)
  console.log(minMag, maxMag)
});


// Create the 'basemap' tile layer that will be the background of our map.
let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// // OPTIONAL: Step 2
// // Create the 'street' tile layer as a second background of the map


// // Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [40, -100],
  zoom: 4
});

// // Then add the 'basemap' tile layer to the map.
baseMap.addTo(myMap)

// // OPTIONAL: Step 2
// // Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// // Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json(link).then(function (data) {

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth<10) {
      return 'green'

    } else if(depth<30) {
      return 'yellowGreen'
    
    } else if(depth<50) {
      return 'yellow'

    } else if(depth<70) {
      return '#ff4f00'

    } else if(depth<90) {
      return 'orange'

    } else {
        return 'red'
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude, minMag=-0.91, maxMag=5.8) {

    // Normalize magnitudes to get all in a range of 25k - 125k:
      // add all values by the minimum (make all positive)
      // divide by max magnitude (make range 0-1)
      // multiply to 100000 (scale up to range 0 - 100k)
      // add 10000 (increae range to 25k - 125k)

    return (((magnitude + minMag) / maxMag) * 100000) + 25000
  }


  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {

    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
        L.circle(latlng, {
          color: 'black',
          weight: .75,
          fillColor: getColor(feature.geometry.coordinates[2]),
          fillOpacity : 0.7,
          radius: getRadius(feature.properties.mag)

        // Bind a Popup to each marker that displays Magnitude, Depth, and Location
        }).bindPopup(`<h1>Magnitude: ${feature.properties.mag}</h1> 
          <h1>Depth: ${feature.geometry.coordinates[2]}</h1> 
          <h1>Location:<h1> <h3>${feature.properties.place}</h3>`).addTo(myMap);;
    },

  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);


  // // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Create Legend div in html file
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth labels and colors for the legend
    let depthLabels = [
      '< 10',
      '10 - 30',
      '30 - 50',
      '50 - 70',
      '70 - 90',
      '90 <'
    ]

    let depthColors = [
      'green',
      'yellowGreen',
      'yellow',
      'orange',
      '#ff4f00',
      'red'
    ]

    // Loop through our depth labels to generate a label with a colored square for each interval.
    for (let i = 0; i<depthLabels.length; i++) {
      div.innerHTML += `<div class="item"><div class="symbol" style="background-color:${depthColors[i]};"></div><span>${depthLabels[i]}</span></div>`
    }
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap)

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.
    // Then add the tectonic_plates layer to the map.
  });
});

