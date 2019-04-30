$( document ).ready(function() {

  // zipcodes.json taken from https://github.com/smartchicago/chicago-atlas/blob/master/db/import/zipcodes.geojson
  // this script taken from http://bl.ocks.org/cjhin/27e01c636dcc0bfa256c7a225971354d
  d3.json("zipcodes.json").then(function(json) {

    //Width and height
    var width = 900;
    var height = 450;

    // create a first guess for the projection
    var center = d3.geoCentroid(json)
    var scale = 150;
    var projection = d3.geoMercator().scale(scale).center(center);

    //Define path generator
    var path = d3.geoPath()
                    .projection(projection);

    // using the path determine the bounds of the current map and use
    // these to determine better values for the scale and translation
    var bounds = path.bounds(json);
    var hscale = scale * width / (bounds[1][0] - bounds[0][0]);
    var vscale = scale * height / (bounds[1][1] - bounds[0][1]);
    var scale = (hscale < vscale) ? hscale : vscale;
    var offset = [width - (bounds[0][0] + bounds[1][0]) / 2,
                     height - (bounds[0][1] + bounds[1][1]) / 2];

    // new projection
    projection = d3.geoMercator().center(center)
     .scale(scale * 0.9).translate(offset);
    path = path.projection(projection);

    //Create SVG element
    var svg = d3.select(".chart")
               .attr("width", width)
               .attr("height", height)

    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "zipcode");

  });

});
