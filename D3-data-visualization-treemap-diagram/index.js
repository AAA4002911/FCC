let margin = { top: 10, right: 10, bottom: 10, left: 10 };

let svg = d3.select("#tree-map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg = d3.select("#tree-map")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let body = d3.select("body");

let tooltip = body.append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("opacity", 0);

let tMap = d3.treemap()
    .size([width, height])
    .paddingInner(1);

let promises = [d3.json("https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json")]

Promise.all(promises).then(ready)

function ready(data) {

    let color = d3.scaleOrdinal().domain(data)
        .range(d3.schemeSet2)

    let root = d3.hierarchy(data[0])
        .eachBefore((d) => {
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
        })
        .sum((d) => { return d.value; })
        .sort((a, b) => { return b.height - a.height || b.value - a.value; });

    tMap(root);

    let cell = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", (d) => { return "translate(" + d.x0 + "," + d.y0 + ")"; });

    let tile = cell.append("rect")
        .attr("id", (d) => { return d.data.id; })
        .attr("class", "tile")
        .attr("width", (d) => { return d.x1 - d.x0; })
        .attr("height", (d) => { return d.y1 - d.y0; })
        .attr("fill", (d) => { return color(d.data.category); })
        .attr("data-name", (d) => { return d.data.name; })
        .attr("data-category", (d) => { return d.data.category; })
        .attr("data-value", (d) => { return d.data.value; })
        .on("mousemove", (d) => {
            tooltip.style("opacity", 1)
            tooltip.html(
                'Name: ' + d.data.name +
                '<br>Category: ' + d.data.category +
                '<br>Value: ' + d.data.value
            )
                .attr('data-value', d.data.value)
                .style('left', (d3.event.pageX + 10) + "px")
                .style('top', (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", (d) => {
            tooltip.style("opacity", 0);
        })

    cell.append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data((d) => { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => { return 13 + i * 10; })
        .text((d) => { return d; })

    let categories = root.leaves().map((nodes) => { return nodes.data.category; });
    categories = categories.filter((category, index, self) => {
        return self.indexOf(category) === index;
    })
    let legend = d3.select("#legend")
    let legendWidth = +legend.attr("width");
    const cLegendOffset = 10;
    const cLegendRectSize = 15;
    const cLegendHSpacing = 150;
    const cLegendVSpacing = 10;
    const cLegendTextXOffset = 3;
    const cLegendTextYOffset = -2;
    let legendElemsPerRow = Math.floor(legendWidth / cLegendHSpacing);

    let legendElem = legend
        .append("g")
        .attr("transform", "translate(60," + cLegendOffset + ")")
        .selectAll("g")
        .data(categories)
        .enter().append("g")
        .attr("transform", (d, i) => {
            return 'translate(' +
                ((i % legendElemsPerRow) * cLegendHSpacing) + ',' +
                ((Math.floor(i / legendElemsPerRow)) * cLegendRectSize +
                    (cLegendVSpacing * (Math.floor(i / legendElemsPerRow)))) + ')';
        })

    legendElem.append("rect")
        .attr('width', cLegendRectSize)
        .attr('height', cLegendRectSize)
        .attr('class', 'legend-item')
        .attr('fill', (d) => { return color(d); })

    legendElem.append("text")
        .attr('x', cLegendRectSize + cLegendTextXOffset)
        .attr('y', cLegendRectSize + cLegendTextYOffset)
        .text((d) => { return d; });
}