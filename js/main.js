// write your javascript code here.
// feel free to change the pre-set attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 800 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

//SVG that will hold the visualization 
let svg1 = d3.select('#d3-container')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') 
  .attr('width', '30%') 
  .attr("height", height)
  .attr("width", width)
  .style('background-color', 'white') 
  .style('border', 'solid')
  .attr('viewBox', [50, 25, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '));

  d3.csv("data/data.csv").then(function(data) {
    
   var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
       yScale = d3.scaleLinear().range ([height, 0]);
   
   xScale.domain(data.map(function(d){ return d.X;}));
   yScale = yScale.domain([0, d3.max(data, function(d){return d.Y;})]);

    var g = svg1.append("g")
    .attr('transform', "translate(" + 100 + "," + 100 + ")");
    
    g.append("g").call(d3.axisBottom(xScale))
    .attr('transform', 'translate (0, ' + height + ')');
    g.append("g").call(d3.axisLeft(yScale));


    const tooltip = d3.select("#d3-container")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
        
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
    const subgroupName = d.X;
    const subgroupValue = d.Y;
    tooltip
        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1)
          }
   const mousemove = function(event, d) {
      tooltip.style("transform","translateY(-55%)")  
            .style("left",(event.x)/2+"px")
            .style("top",(event.y)/2-30+"px")
          }
    const mouseleave = function(event, d) {
            tooltip
              .style("opacity", 0)
          }

    g.selectAll(".bar") 
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {return xScale(d.X);})
            .attr("y", function(d) {return yScale(d.Y);})
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {return height - yScale(d.Y);})
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);


        
  });

// scatterplot visualization for hw-03 resubmission
let svg3 = d3.select('#vis1')
.append('svg')
.attr('preserveAspectRatio', 'xMidYMid meet') 
.attr('width', '50%') 
.attr("height", height)
.attr("width", width)
.style('background-color', 'white') 
.style('border', 'solid')
.attr('viewBox',[50, 50, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '));

d3.csv("data/DataSet2.csv").then( function(data) {

  // Add X axis
  var x = d3.scaleLinear()
  .domain([0, 100])
  .range([ 0, width ]);
  svg3.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
  .domain([0, 100])
  .range([ height, 0]);
  svg3.append("g")
  .call(d3.axisLeft(y));

  // Add dots
  svg3.append('g')
  .selectAll("dot")
  .data(data)
  .join("circle")
      .attr("cx", function (d) { return x(d.Fish); } )
      .attr("cy", function (d) { return y(d.Plants); } )
      .attr("r", 5)
      .style("fill", "#69b3a2")

})

// grouped bar chart for hw-03 resubmission
let svg2 = d3
  .select("#vis2")
  .append("svg")
  .attr("preserveAspectRatio", "xMidYMid meet") // this will scale your visualization according to the size of its parent element and the page.
  .attr("width", "100%") // this is now required by Chrome to ensure the SVG shows up at all
  .style("background-color", "#ccc") // change the background color to light gray
  .attr(
    "viewBox",
    [
      0,
      0,
      width + margin.left + margin.right,
      height + margin.top + margin.bottom,
    ].join(" ")
  );

// code for grouped bar chart
d3.csv("data/Boston Food Review - Sheet1.csv").then(function (data) {
  // create the subgroups using the 4th and 5th columns of the data (rating and distance)
  var subgroups = data.columns.slice(4);

  // create the list of groups
  var groups = data.map((d) => d.Name);

  // add the created groups to the visualization
  console.log(groups);

  // add x axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg2
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0));

  // add y axis
  var y = d3.scaleLinear().domain([0, 12]).range([height, 0]);
  svg2.append("g").call(d3.axisLeft(y));

  // scale subgroups
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // create colors and give a color to each subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#e41a1c", "#377eb8"]);

  // show the bars
  svg2
    .append("g")
    .selectAll("g")
    // Enter in data
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.Name)}, 0)`)
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .join("rect")
    .attr("x", (d) => xSubgroup(d.key))
    .attr("y", (d) => y(d.value))
    .attr("width", xSubgroup.bandwidth())
    .attr("height", (d) => height - y(d.value))
    .attr("fill", (d) => color(d.key))
    .append("title")
    .text(function (d) {
      return "" + d.key + ": " + d.value; //details on demand mouseover displays the data values
    });
});
