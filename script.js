import * as d3 from 'https://unpkg.com/d3?module';

const body = d3.select('.container');
const h = 500;
const w = 900;
const padding = 38;

var svg = body.append("svg")
    .attr("width", w)
    .attr("height", h);

const quarter = function(year){
  year = year.toISOString().slice(0,10)
  var temp = year.substring(5, 7);
  var q;
      if (temp === '03') {
        q = 'Q1';
      } else if (temp === '06') {
        q = 'Q2';
      } else if (temp === '09') {
        q = 'Q3';
      } else if (temp === '12') {
        q = 'Q4';
      }

      return year.substring(0, 4) + ' ' + q;
}

document.addEventListener('DOMContentLoaded', function(){
  const req = new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
  req.send();
  req.onload = function(){
      const json = JSON.parse(req.responseText);
      let html = '';
      const dataset = []

      
      const parseTime = d3.timeParse("%Y-%m-%d");

      json.data.forEach(function(val){
          val[0] = parseTime(val[0]); 
          dataset.push(val);
      })

      
      const xScale = d3.scaleTime()
          .domain(d3.extent(dataset, (d) => d[0])) 
          .range([padding, w - padding]);

      
      const yScale = d3.scaleLinear()
          .domain([0, d3.max(dataset, (d) => d[1])])
          .range([h - padding, padding]);

      var tooltip = d3
      .select('.visHolder')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

      var overlay = d3
      .select('.visHolder')
      .append('div')
      .attr('class', 'overlay')
      .style('opacity', 0);




      svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d[0]))
      .attr("y", (d, i) => yScale(d[1]))
      .attr("width", 3)
      .attr("height", (d, i) => h - padding - yScale(d[1]))
      .attr("fill", "#9f04ff")
      .attr("class", "bar")
      .on('mouseover', function (event, d) {
        const [x, y] = d3.pointer(event, svg.node());
    
        overlay
            .transition()
            .duration(0)
            .style('height', h + 'px')
            .style('width', 3 + 'px')
            .style('opacity', 0.9)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY) + 'px');
    
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
            .html(quarter(d[0])+'<br>' + '$' + d[1].toLocaleString()+ ' Billion')
            .style('left', (event.pageX + 30) + 'px') // Adjust these values as needed
            .style('top', (event.pageY - 30) + 'px'); // Adjust these values as needed
    })
    .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
    });




      
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
      
      svg.append("g")
          .attr("transform", "translate(0," + (h - padding) + ")")
          .call(xAxis);

      svg.append("g")
          .attr("transform","translate("+padding+",0)")
          .call(yAxis);


      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50)
      .attr("x",100 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Gross Domestic Product"); 

      document.getElementsByClassName('message')[0].innerHTML = html;
  };
});