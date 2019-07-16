
			d3.json("A3_Parallel.json", function(error, data) {
        var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 960 ,
        height = 390 ;
        
        var dimensions = [
          {
              name: "Top 5000?",
              scale: d3.scale.ordinal().rangePoints([0,height*9/10]),
              type: "string"
          },
          {
              name: "Days Trending",
              scale: d3.scale.ordinal().rangePoints([0,height*9/10]),
              type: "string"
          },
          {
              name: "Initial Trending Date",
              scale: d3.scale.ordinal().rangePoints([0,height*9/10]),
              type: "string"
          },
          {
              name: "Country",
              scale: d3.scale.ordinal().rangePoints([0,height*9/10]),
              type: "string"
          },
          {
              name: "Number of Videos",
              scale: d3.scale.linear().range([height*9/10,0]),
              type: "number"
          }
        ];
        
        var x = d3.scale.ordinal().domain(dimensions.map(function(d) { return d.name; })).rangePoints([0, width*3/4]),
            y = {},
            dragging = {};
        
        var line = d3.svg.line(),
          axis = d3.svg.axis().orient("left"),
          background,
          foreground;
        
          var svg = d3.select("svg").append("g")
					.attr("width", width )
					.attr("height", height )
				.append("g")
					.attr("transform", "translate(" + width*4/7 + "," + 40 + ")");

        
				//Create the dimensions depending on attribute "type" (number|string)
				//The x-scale calculates the position by attribute dimensions[x].name
				dimensions.forEach(function(dimension) {
					dimension.scale.domain(dimension.type === "number"
						? d3.extent(data, function(d) { return +d[dimension.name]; })
						: data.map(function(d) { return d[dimension.name]; }));
				});

				// Add grey background lines for context.
				background = svg.append("g")
						.attr("class", "background")
					.selectAll("path")
						.data(data)
					.enter().append("path")
						.attr("d", path);

				// Add blue foreground lines for focus.
				foreground = svg.append("g")
						.attr("class", "foreground")
					.selectAll("path")
						.data(data)
					.enter().append("path")
						.attr("d", path).style("stroke", function(d){
              switch(d.Country){
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
          .on('mouseover',function(thisElement,index){
            var x = document.getElementsByClassName('parallel');  
            d3.selectAll(x).transition()
                .duration(50)
                .style('opacity',0.005);
            
            var y = document.getElementsByClassName('sunburst');  
            
            console.log(y);

            d3.selectAll(y).transition()
                .duration(50)
                .style('opacity',0.1);

            
            var v = document.getElementsByClassName(thisElement.Country+" "+ thisElement.Is_in_5K+" "+ thisElement.Initial_Trending +" "+ thisElement.No_of_Days);

            
            d3.selectAll(v).transition()
                  .duration(500)
                  .style("opacity",1);
            
            var z = function(thisElement){
             switch(thisElement.Country+" "+ thisElement.Is_in_5K){
                    case 'Canada Other Youtubers': return document.getElementsByClassName('Canada Other Youtubers sunburst'); break; 
                    case 'Germany Other Youtubers': return document.getElementsByClassName('Germany Other Youtubers sunburst'); break;
                    case 'France Other Youtubers': return document.getElementsByClassName('France Other Youtubers sunburst'); break;
                    case 'Great Britain Other Youtubers': return document.getElementsByClassName('Great Britain Other Youtubers sunburst'); break;
                    case 'India Other Youtubers': return document.getElementsByClassName('India Other Youtubers sunburst'); break;
                    case 'South Korea Other Youtubers': return document.getElementsByClassName('South Korea Other Youtubers sunburst'); break;
                    case 'Mexico Other Youtubers': return document.getElementsByClassName('Mexico Other Youtubers sunburst'); break;
                    case 'Russia Other Youtubers': return document.getElementsByClassName('Russia Other Youtubers sunburst'); break;
                    case 'USA Other Youtubers': return document.getElementsByClassName('USA Other Youtubers sunburst'); break;
                    case 'Japan Other Youtubers': return document.getElementsByClassName('Japan Other Youtubers sunburst'); break;
                    case 'Canada top5K': return document.getElementsByClassName('Canada top5K sunburst'); break; 
                    case 'Germany top5K': return document.getElementsByClassName('Germany top5K sunburst'); break;
                    case 'France top5K': return document.getElementsByClassName('France top5K sunburst'); break;
                    case 'Great Britain top5K': return document.getElementsByClassName('Great Britain top5K sunburst'); break;
                    case 'India top5K': return document.getElementsByClassName('India top5K sunburst'); break;
                    case 'South Korea top5K': return document.getElementsByClassName('South Korea top5K sunburst'); break;
                    case 'Mexico top5K': return document.getElementsByClassName('Mexico top5K sunburst'); break;
                    case 'Russia top5K': return document.getElementsByClassName('Russia top5K sunburst'); break;
                    case 'USA top5K': return document.getElementsByClassName('USA top5K sunburst'); break;
                    case 'Japan top5K': return document.getElementsByClassName('Japan top5K sunburst'); break;
                }
            }
            var z1 = z(thisElement)
            console.log(z1);
            d3.selectAll(z1).transition()
                  .duration(500)
                  .style("opacity",1);
            
          })
          .on('mouseout', function(thisElement,index){
            d3.selectAll('path').transition()
                .duration(500)
                .style('opacity',1);
          })
          .attr('visibility','hidden');

				// Add a group element for each dimension.
				var g = svg.selectAll(".dimension")
							.data(dimensions)
						.enter().append("g")
							.attr("class", "dimension")
							.attr("transform", function(d) { return "translate(" + x(d.name) + ")"; })
						.call(d3.behavior.drag()
								.origin(function(d) { return {x: x(d.name)}; })
							.on("dragstart", function(d) {
								dragging[d.name] = x(d.name);
								background.attr("visibility", "hidden");
							})
							.on("drag", function(d) {
								dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
								foreground.attr("d", path);
								dimensions.sort(function(a, b) { return position(a) - position(b); });
								x.domain(dimensions.map(function(d) { return d.name; }));
								g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
							})
							.on("dragend", function(d) {
								delete dragging[d.name];
								transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
								transition(foreground).attr("d", path);
								background
									.attr("d", path)
									.transition()
										.delay(500)
										.duration(0)
										.attr("visibility", null);
							})
						);

				// Add an axis and title.
				g.append("g")
						.attr("class", "axis")
					.each(function(d) { d3.select(this).call(axis.scale(d.scale)); })
						.append("text")
							.style("text-anchor", "middle")
							.attr("class", "axis-label")
							.attr("y", -19)
              .text(function(d) { return d.name; })
              .on('mouseover',function(d){
                foreground.attr('visibility','hidden')
              });

				// Add and store a brush for each axis.
				g.append("g")
						.attr("class", "brush")
					.each(function(d) {
						d3.select(this).call(d.scale.brush = d3.svg.brush().y(d.scale).on("brushstart", brushstart).on("brush", brush));
					})
					.selectAll("rect")
						.attr("x", -8)
            .attr("width", 16);
            



            function path(d) {
              //return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
              return line(dimensions.map(function(dimension) {
                var v = dragging[dimension.name];
                var tx = v == null ? x(dimension.name) : v;
                return [tx, dimension.scale(d[dimension.name])];
              }));
            }
            
            function position(d) {
              var v = dragging[d.name];
              return v == null ? x(d.name) : v;
            }
      
            function transition(g) {
              return g.transition().duration(500);
            }
      
            // Returns the path for a given data point.
            
      
            function brushstart() {
              d3.event.sourceEvent.stopPropagation();
              foreground.attr('visibility','hidden')
              
            }
      
            // Handles a brush event, toggling the display of foreground lines.
            function brush() {
              var actives = dimensions.filter(function(p) { return !p.scale.brush.empty(); }),
                extents = actives.map(function(p) { return p.scale.brush.extent(); });
      
              foreground.style("display", function(d) {
                return actives.every(function(p, i) {
                  if(p.type==="number"){
                    return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
                  }else{
                    return extents[i][0] <= p.scale(d[p.name]) && p.scale(d[p.name]) <= extents[i][1];
                  }
                }) ? null : "none";
              })
              .attr('visibility', function(actives){ 
                if(actives == null)
                {return 'hidden'}
                else {
                  return 'visible'
                }
              });

              
            }
			});

			

    