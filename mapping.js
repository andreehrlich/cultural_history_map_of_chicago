$( document ).ready(function() {

  // zipcodes.json taken from https://github.com/smartchicago/chicago-atlas/blob/master/db/import/zipcodes.geojson
  // this script taken from http://bl.ocks.org/cjhin/27e01c636dcc0bfa256c7a225971354d
  // d3.json("zipcodes.json").then(function(json) {

  Promise.all([d3.json("sites.json"), d3.json("zipcodes.json")]).then(function(data) {
      //console.log(data);
    var zipcodes = data[1];
    var sites = data[0];
      console.log(data);
      console.log(sites);
    //Width and height
    var width = 450;
    var height = 450;

    // create a first guess for the projection
    var center = d3.geoCentroid(zipcodes)
    var scale = 100;
    var projection = d3.geoMercator().scale(scale).center(center);

    //Define path generator
    var path = d3.geoPath().projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds = path.bounds(zipcodes);
    var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    var scale = (hscale < vscale) ? hscale : vscale;
    var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                  height - (bounds[0][1] + bounds[1][1]) / 2];

      console.log(offset);
      offset = [240, 200];
    // new projection
    projection = d3.geoMercator().center(center)
     .scale(scale).translate(offset);
    path = path.projection(projection);

    //Create SVG element
    var svg = d3.select(".chart")
               .attr("width", width)
               .attr("height", height)

    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
      .data(zipcodes.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "zipcode")
      // .attr("zip", json.properties.ZIP)
      // .on("mouseover", function(d){
    	// 	d3.select("h2").text(d.properties.ZIP);
    	// 	d3.select(this).attr("class","incident hover");
    	// });


    svg.selectAll("circle")
      .data(sites.features)
      .enter()
      .append("circle")
      // .attr("fill", "#880e4f")
      .attr("class", "site")
      .attr("r", 7)
      .attr("cx", function(d) {
        var cx = projection(d.geometry.coordinates)[0]/450;
        console.log("cx: ", cx)
        return cx;
      })
      .attr("cy", function(d) {
        var cy = projection(d.geometry.coordinates)[1]/700;
        console.log("cy: ", cy)
        return cy;
      })
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
      //.on("mouseout", function(d){
      //	d3.select(".site-info").classed("hidden", true);
        // d3.select(".site-address").text("");
        // d3.select(".site-image").attr("src", "");
        // d3.select(".site-description").text("");

      //})
      //.on("click", function(d){
      //  d3.select("")
      //})
      // .

  })

});
