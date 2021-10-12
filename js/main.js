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
