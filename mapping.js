$( document ).ready(function() {

  // zipcodes.json taken from https://github.com/smartchicago/chicago-atlas/blob/master/db/import/zipcodes.geojson
  // the coordinates were flipped, so I fixed them with the fix_zipcode_coord.js script

  // this script taken from http://bl.ocks.org/cjhin/27e01c636dcc0bfa256c7a225971354d



  Promise.all([d3.json("sites.json"), d3.json("zipcodes.json")]).then(function(data) {
      //console.log(data);
    var zipcodes_json = data[1];
    var sites_json = data[0];

    console.log("sites: ", sites_json);


    //Width and height
    var width = 400;
    var height = 450;

    //Create SVG element
    var svg = d3.select(".chart")
               .attr("width", width)
               .attr("height", height)


    // // create a first guess for the projection

    var center = d3.geoCentroid(zipcodes_json)

    projection = d3.geoMercator()
      .center(center)
      .scale(40000)
      .translate([200, 250]);

    geoPath = d3.geoPath().projection(projection);

    //Bind data and create one path per GeoJSON feature
    var zipcodes = svg.append('g');

    zipcodes.selectAll('path')
      .data(zipcodes_json.features)
      .enter()
      .append('path')
      .attr('d', geoPath)
      .attr('class', 'zipcode')

    var sites = svg.append('g');

    sites.selectAll('path')
      .data(sites_json.features)
      .enter()
      .append('path')
      .attr('d', geoPath.pointRadius(10))
      .attr('fill', 'red')
      .attr('stroke', '2')
      .attr("class", "site")
      .on("click", function(d){
      	d3.select(".site-title").text(d.properties.name);
        d3.select(".site-address").text(d.properties.address);
        d3.select(".site-description").text(d.properties.description);
        d3.select(".site-investigator").text("Investigator: " + d.properties.investigator);
        d3.select(".site-image")
          .attr("src", d.properties.img)
          .attr('alt', d.properties.img.split(',')[0]);
        d3.select(".site-info").classed("hidden", false);
      })

  })

});
