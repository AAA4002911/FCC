w = window.innerWidth - (window.innerWidth / 3);
h = window.innerHeight  - (window.innerHeight / 4);

let dataset = []

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then(raw => raw.json()).then(data => {
    dataset = data;
    const padding = 50;

    let toolTip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0)

    let svg = d3.select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('id', 'title')


    const timeFormat = d3.timeFormat('%M:%S')
    const color = { true: '#FF7F0E', false: '#1F77B4' }
    const legendData = ['Riders with doping allegations', 'No doping allegations']

    const years = dataset.map(d => d['Year'])
    const time = dataset.map(d => d['Time'].split(':'))
    let timeForDomain = time.map(d => {
        d = new Date(2000, 0, 1, 0, parseInt(d[0]), parseInt(d[1]), 0)
        return d
    })


    const xScale = d3.scaleLinear()
        .domain([d3.min(years, d => d - 1), d3.max(years, d => d + 1)])
        .range([padding, w - padding])

    const yScale = d3.scaleTime()
        .domain([d3.min(timeForDomain), d3.max(timeForDomain)])
        .range([h - padding, padding + 50])


    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)


    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - padding) + ')')
        .call(xAxis)
    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis)

    svg.append("text")
        .attr("id", "title")
        .attr("x", w / 2)
        .attr("y", padding / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .text("Doping in Professional Bicycle Racing")
    
    svg.append("text")
        .attr("id", "sub-title")
        .attr("x", w / 2)
        .attr("y", padding)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("35 Fastest times up Alpe d'Huez")

    const leftCoords = [padding - 40, padding + 20]
    svg.append('text')
        .attr('transform', `rotate(-90, ${leftCoords[0]}, ${leftCoords[1]})`)
        .attr('x', leftCoords[0])
        .attr('y', leftCoords[1])
        .attr('class', 'label left')
        .attr('text-anchor', 'end')
        .text('Time in Minutes')

    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d, i) => xScale(d['Year']))
        .attr('cy', (d, i) => yScale(timeForDomain[i]))
        .attr('r', 6)
        .attr('data-xvalue', d => d['Year'])
        .attr('data-yvalue', (d, i) => timeForDomain[i].toLocaleString())
        .style('fill', d => color[d['Doping'] == ''])
        .on('mouseover', (d, i) => {
            toolTip.transition()
                .delay(100)
                .style('opacity', 1)
            toolTip
                .html(`<strong>${d['Name']}</strong>, ${d['Year']}${d['Doping'] == '' ? '' : '<br />'}${d['Doping']}`)
                .attr('data-year', d['Year'])
                .style('top', d3.event.pageY + 5 + 'px')
                .style('left', d3.event.pageX + 5 + 'px')
        })
        .on('mouseout', (d, i) => {
            toolTip.transition()
                .style('opacity', '0')
        })

    let legend = svg.selectAll('.legend')
        .data(Object.values(color))
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('id', 'legend')
        .style('transform', (d, i) => `translate(0, ${h / 2 - (i * 25)}px)`)

    legend.append('rect')
        .attr('x', w - 30)
        .attr('height', 20)
        .attr('width', 20)
        .attr('fill', d => d)

    legend.append('text')
        .attr('x', w - 35)
        .attr('y', 9)
        .style('text-anchor', 'end')
        .text((d, i) => legendData[i])
})