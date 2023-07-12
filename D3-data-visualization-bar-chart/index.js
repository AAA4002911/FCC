(function () {
    fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(function (response) { return response.json() })
        .then(function (data) {

            let marginTop = 10;
            let marginBottom = 25;
            let marginLeft = 60;
            let marginRight = 15;
            let width = 700 - marginLeft;
            let height = 400 - marginBottom;
            let maxDate = new Date(data.to_date);
            let minDate = new Date(data.from_date);

            // Declare the x (horizontal position) scale.
            let scaleX = d3.scale.ordinal()
                .domain(d3.range(0, data.data.length))
                .rangeBands([0, width - marginRight]);

            // Declare the y (vertical position) scale.
            let scaleY = d3.scale.linear()
                .domain([0, d3.max(data.data.map(function (d) { return d[1]; }))])
                .range([0, height - marginTop]);

            let axisY = d3.svg.axis()
                .scale(d3.scale.linear()
                    .domain([d3.max(data.data.map(function (d) { return d[1]; })), 0])
                    .range([0, height - marginTop]))
                .orient("left")
                .ticks(11);

            let axisX = d3.svg.axis()
            .scale(d3.time.scale()
            .domain([minDate, maxDate])
            .range([0, width - marginRight]))
                .orient('bottom')
                .ticks(d3.time.years, 5);
                
                // Create the SVG container.
                let svg = d3.select('.chart')
                .append('svg')
                .attr('width', width + marginLeft)
                .attr('height', height + 100)
                .attr("viewBox", [0, 0, width, height])
                
                let toolTip = d3.select('.chart')
                .append('div')
                .attr('class', 'tooltip')
                .attr('style', 'visibility: hidden;')
                
                svg.append('g')
                .append('text')
                .attr('x', marginLeft * 2)
                .attr('y', marginBottom)
                .attr("style", "font-family:sans;font-size: 29px;font-weight:100; stroke:#444;")
                .text(data.source_name)
                
                svg.append('g')
                .attr('transform', 'translate(' + marginLeft + ', ' + marginTop + ')')
                .attr('id', 'y-axis')
                .call(axisY)
                .selectAll('line')
                .style({ 'stroke': '#000', 'stroke-width': '0.1' })
                .selectAll('text')
                .attr("style", "font-size: 12px;")
                
                svg.append('g')
                .attr('transform', 'translate(' + marginLeft + ', ' + height + ')')
                .attr('id', 'x-axis')
                .call(axisX)
                .selectAll('line')
                .style({ 'stroke': '#000', 'stroke-width': '0.1' })
                .selectAll('text')
                .attr("style", "font-size: 12px;")

            svg.append('g')
                .attr('transform', 'translate(' + marginLeft + ',0)')
                .selectAll('rect')
                .data(data.data)
                .enter()
                .append('rect')
                .style({ 'fill': '#33ADFF' })
                .attr('class', 'bar')
                .attr('data-date', function (d) { return d[0]})
                .attr('data-gdp', function (d) { return d[1]})
                .attr('width', scaleX.rangeBand())
                .attr('height', function (d) { return scaleY(d[1]) })
                .attr('x', function (d, i) { return i * scaleX.rangeBand() })
                .attr('y', function (d) { return height - scaleY(d[1]) })
                .on('mouseover', function (d) {
                    let posX = d3.event.pageX;
                    let posY = d3.event.pageY;
                    toolTip
                        .attr('id', 'tooltip')
                        .attr('data-date', d[0])
                        .attr('style', 'left:' + posX + 'px;top:' + posY + 'px; visibility: visible;')
                        .html(d[0] + '<br /><strong>' + d[1] + '</strong>')

                    d3.select(this).style('fill', '#FFF');
                })
                .on('mouseout', function (d) {
                    d3.select(this).style('fill', '#33ADFF');
                    toolTip.attr('style', 'visibility: hidden;');
                })
        });
})();