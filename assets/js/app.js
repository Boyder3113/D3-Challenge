// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select(".chart")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var initialXAxis = "poverty";

function scale1(data1, initialXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data1, d=> d[initialXAxis])*0.8,
        d3.max(data1, d => d[initialXAxis]) * 1.2
    ])
    .range([0,width]);
}

function renderAxes1(XScale1, xAxis1) {
    var bottomAxis = d3.axisBottom(XScale1);

    xAxis1.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis1
}

function renderCircles1(circlesGroup1, XScale1, initialXAxis) {
    circlesGroup1.transition()
    .duration(1000)
    .attr("cx", d => XScale1(d[initialXAxis]));

    return circlesGroup1;
}

function ToolTip1(initialXAxis, circlesGroup1) {
    var label;

    if (initialXAxis === "poverty") {
        label = "In Poverty(%)";
    }
    else if (xAxis1 === "age") {
        label = "Age (Median)";
    }
    else {
        label = "Household Income (Median)";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d){
        return(`State variable, obesity variable, poverty variable`)
    });

    circlesGroup1.call(toolTip);

    circlesGroup1.on("mouseover", function(data1){
        toolTip.show(data1);
    })
        .on("mouseout", function(data1, index){
            toolTip.hide(data1);
        });
    return circlesGroup1;
}

//start with importing all data and see if it populates correctly

d3.csv("data.csv").then(function(data1,err){
    if (err) throw err;

    data1.foreach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.low;
        data.smokes = +data.smokes;
        data.income = +data.income;
        data.obesity = +data.obesity
    });

    var xLinearScale = XScale1(data1, initialXAxis);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.healthcare)])
    .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis1 = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup1 = chartGroup.selectAll("circle")
    .data(data1)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[initialXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r",20)
    .attr("fill", "blue")
    .attr("opacity", ".5");

    var labelsGroup = chartGroup.append("g")
    .attr("transform",`translate(${width/2}, ${height + 20})`):

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty(%)");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .classed("inactive", true)
    .text("Age(Median)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)")

    var circlesGroup1 = updateToolTip(initialXAxis, circlesGroup1)

    labelsGroup.selectAll("text")
    .on("click", function(){

        var value = d3.select(this).attr("value");
        if (value !== initialXAxis){
            initialXAxis = value;
            
            xLinearScale = XScale1(data1, initialXAxis);

            xAxis1 = renderAxes1(xLinearScale, xAxis1);

            circlesGroup1 = renderCircles1(circlesGroup1, xLinearScale, initialXAxis);

            circlesGroup1 = updateToolTip(initialXAxis, circlesGroup1);

            if (initialXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inacitve", true);
            }
            else {
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });
}).catch(function(error){
    console.log(error);
});