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
    var height = 600;

    //Create SVG element
    var svg = d3.select(".chart")
               .attr("width", width)
               .attr("height", height)


    // // create a first guess for the projection

    var center = d3.geoCentroid(zipcodes_json)

    projection = d3.geoMercator()
      .center(center)
      .scale(50000)
      .translate([width/2 + 50, height/2]);

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

    sites.selectAll('circle')
      .data(sites_json.features)
      .enter()
      .append('path')
      .attr('d', geoPath.pointRadius(10))
      .attr('fill', 'red')
      .attr('stroke', '2')
      .attr('opacity', '0.9')
      .attr("class", "site")
      .attr("id", function(d){
        return d.properties.name;
      })
      .on("click", function(d){
        var site_name = d.properties.name;
        show_site(site_name);
        set_active(site_name);
      })


    var list_of_sites = document.getElementById('list_of_sites');

    for (feature of sites_json.features) {
      var site_name = feature.properties.name;
      // console.log(site_name);
      // console.log(feature.properties);

      // create <li> element with site name
      var node = document.createElement("LI");
      var textnode = document.createTextNode(site_name);
      node.appendChild(textnode);

      // when clicked, show site description
      node.onclick=function(){
        var this_site_name = this.childNodes[0].nodeValue;
        show_site(this_site_name);
        set_active(this_site_name);

        // color the whole map for 'Digital Colonialism'
        var zipcode_els = document.getElementsByClassName('zipcode');
        for (zipcode of zipcode_els) {
          console.log("zipcode: ", zipcode);
          if (this_site_name === "Digital Colonialism") {
            zipcode.classList.add('cover');
          } else {
            zipcode.classList.remove('cover');
          }
        }

      };

      list_of_sites.appendChild(node);

    }

    var current_active = null;

    function set_active(site_id) {

      if (current_active) {
        document.getElementById(current_active).classList.remove("active");
      }
      current_active = site_id;

      var element = document.getElementById(current_active);
      element.classList.add("active");
    };

    function show_site(name) {
      for (feature of sites_json.features) {
        var site_name = feature.properties.name;

        if (name === site_name) {
          d3.select(".site-title").text(feature.properties.name);
          d3.select(".site-address").text(feature.properties.address);
          d3.select(".site-description").text(feature.properties.description);
          d3.select(".site-investigator").text("Investigator: " + feature.properties.investigator);
          d3.select(".site-image")
            .attr("src", feature.properties.img)
            .attr('alt', feature.properties.img.split(',')[0]);
          d3.select(".site-info").classed("hidden", false);
        }
      }
    }



  })

});
