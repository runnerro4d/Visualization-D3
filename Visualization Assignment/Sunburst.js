

var width = 400,
    height = 600,
    radius = Math.min(width, height*2/3) / 2;


    var color = ['#4c78a8','#9ecae9','#f58518','#ffbf79','#54a24b','#88d27a','#b79a20','#f2cf5b','#439894','#83bcb6','#e45756','#ff9d98']

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius])
    .value(function(d) { return d["Number of videos"]; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return d.y; })
    .outerRadius(function(d) { return d.y + d.dy; });

d3.select("body").append('h3')
  .text('Number of videos trending in each month/country/youtuber type')
  .style('color','white')
  .style('font-family','sans-serif')
  .style('text-align','center');


var svg = d3.select("body").append("svg")
    .attr("width", "100%")
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width*2/3) + "," + height/3 +")");

d3.json("A3_Sunburst.json", function(error, root) {
  if (error) throw error;
  
  var toolTip = d3.select("body").append("div").attr("class","toolTip").style("opacity",0);
  
  path = svg.data([root]).selectAll("path")
      .data(partition.nodes)
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d){
          
        switch(d.name){
          case 'Canada': return color[0]; break; 
          case 'Germany': return color[1]; break;
          case 'France': return color[2]; break;
          case 'Great Britain': return color[3]; break;
          case 'India': return color[4]; break;
          case 'South Korea': return color[5]; break;
          case 'Mexico': return color[6]; break;
          case 'Russia': return color[7]; break;
          case 'USA': return color[8]; break;
          case 'Japan': return color[9]; break;
          case 'top5K': return color[10]; break;
          case 'Other Youtubers': return color[11]; break;
        }

        if (d.name != root.name){
        switch(d.parent.name){
          case 'Canada': return color[0]; break; 
          case 'Germany': return color[1]; break;
          case 'France': return color[2]; break;
          case 'Great Britain': return color[3]; break;
          case 'India': return color[4]; break;
          case 'South Korea': return color[5]; break;
          case 'Mexico': return color[6]; break;
          case 'Russia': return color[7]; break;
          case 'USA': return color[8]; break;
          case 'Japan': return color[9]; break;
          case 'top5K': return color[10]; break;
          case 'Other Youtubers': return color[11]; break;
        }
      }

    })
    .style('stroke','#fff')
    .attr("class",function (d){ return (d.parent? d.name +" "+d.parent.name + " sunburst": d.name + " sunburst")})
    .style('stroke-width',"1px")
    .on("click", function(d){
      IncreaseSize(d)
      hideBar();
      var months = ["Nov-17","Dec-17","Jan-18","Feb-18","Mar-18","Apr-18","May-18","Jun-18"]
        var top = ['top5K','Other Youtubers','root']
        if( months.includes(d.name)!= true && top.includes(d.name)!= true)
        {makeBar(d.children,d.name);}
    })
    .each(ReduceSize)
    .on("mouseover",function (thisElement,index){
        d3.selectAll('path').transition()
              .duration(500)
              .attr("opacity", 0.1);
        
        d3.select(this).transition()
              .duration(500)
              .attr("opacity",1);
        
       if(thisElement.name!= "root")
       {toolTip.transition()
                      .duration(600)
                      .style("opacity", 0.8);}
        
        var x = document.getElementsByClassName('root');

        console.log(x[0]);
        var months = ["Nov-17","Dec-17","Jan-18","Feb-18","Mar-18","Apr-18","May-18","Jun-18"]
        var top = ['top5K','Other Youtubers']
        if( months.includes(thisElement.name)!= true && top.includes(thisElement.name)!= true){
              var total = 0;
              for(i = 0; i <thisElement.children.length; i++){
                    total += thisElement.children[i]["Number of videos"];
                    toolTip.html("<h4>" + thisElement.name + "</h4>"+"<p>" + Math.round(total)+ " trending videos</p>")
                    .style("left", width/2 + 50+"px")
                    .style("top", height/2 - 80 + "px")
                    .style("position","absolute");
              }
        }
        else if(thisElement.name == "top5K" || thisElement.name == "Other Youtubers"){
          var total = 0;
          console.log(thisElement);
          for(i = 0; i <thisElement.children.length; i++){
            for(j=0;j<thisElement.children[i].children.length;j++){
                
                total += thisElement.children[i].children[j]["Number of videos"];}
                toolTip.html("<h4>" + thisElement.name + "</h4>"+"<p>" + Math.round(total)+ " trending videos</p>")
                .style("left", width/2 + 50 +"px")
                .style("top", height/2 -80+"px")
                .style("position","absolute");
          }
    }

        else
        {     
              toolTip.html("<p>" + thisElement.name + "</p>"+"<p>" + Math.round(thisElement["Number of videos"])+ " trending videos</p>")
                    .style("left", width/2 + 50 +"px")
                    .style("top", height/2 -80+"px")
                    .style("position","absolute");      
         }

  })
  .on("mouseout",function (thisElement,index){
        d3.selectAll('path').transition()
              .duration(100)
              .attr("opacity", 1);
        
        d3.select(this).transition()
              .duration(100)
              .attr("opacity",1);
        
        toolTip.transition()
                      .duration(600)
                      .style("opacity", 0);

  });

});

function IncreaseSize(node) {
  console.log(node);
  if (parent = node.parent) {
    var parent,
        x = parent.x,
        k = .8;
    parent.children.forEach(function(sibling) {
      x += reposition(sibling, x, sibling === node
          ? parent.dx * k / node.value
          : parent.dx * (1 - k) / (parent.value - node.value));
    });
  } else {
    reposition(node, 0, node.dx / node.value);
  }

  path.transition()
      .duration(750)
      .attrTween("d", arcTween);
}

// Recursively reposition the node at position x with scale k.
function reposition(node, x, k) {
  node.x = x;
  if (node.children && (n = node.children.length)) {
    var i = -1, n;
    while (++i < n) x += reposition(node.children[i], x, k);
  }
  return node.dx = node.value * k;
}

function ReduceSize(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };

}
  
function makeBar(data,country){
    console.log(data);
var x = d3.scale.ordinal().rangeRoundBands([0, width/2], .1);

var y = d3.scale.linear().range([height*1/5, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

    x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d['Number of videos']; })]);

  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height*4/7 + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" +width/100 + ","+height*3/8+")")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Videos");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .attr("transform", "translate(" +width/100 + ","+height*3/8+")")
      .attr('class','bar')
      .style("fill", function(d){
          
        switch(country){
          case 'Canada': return color[0]; break; 
          case 'Germany': return color[1]; break;
          case 'France': return color[2]; break;
          case 'Great Britain': return color[3]; break;
          case 'India': return color[4]; break;
          case 'South Korea': return color[5]; break;
          case 'Mexico': return color[6]; break;
          case 'Russia': return color[7]; break;
          case 'USA': return color[8]; break;
          case 'Japan': return color[9]; break;
        }
      })
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d["Number of videos"]); })
      .attr("height", function(d) { return height*1/5  - y(d['Number of videos']); });

      
};

function hideBar(){
  var a = document.getElementsByClassName("bar");
  var b = document.getElementsByClassName("x-axis");
  var c = document.getElementsByClassName("y-axis");

  d3.selectAll(a).remove();
    
    d3.selectAll(b).remove();

    d3.selectAll(c).remove();
}

  
