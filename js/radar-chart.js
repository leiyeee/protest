function radarChart(selector, rawData, years) {
  const width = 500
  const height = width
  const margin = 10
  const outerRadius = width / 2 - margin
  const innerRadius = width / 10
  // curveLinearClosed
  // curveCardinal
  // curveCardinalClosed
  // curveBasis

  const area = d3.areaRadial()
    .curve(d3.curveCardinalClosed)
    .angle((d, i) => {
      return angleScale(i)
    })

  const line = d3.lineRadial()
    .curve(d3.curveCardinalClosed)
    .angle((d, i) => angleScale(i))

  // const colors = d3.

  let direction = 'inner'
  let clickYear = ''
  let clickMouth = ''
  const eventsData = _.uniq(_.pluck(rawData, 'Event'))
  const rawDataGroupByEvent = _.groupBy(rawData, d => d.Event)
  const rawDataGroupByYear = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}`)
  const rawDataGroupByYearMouth = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}-${new Date(d.Date).getUTCMonth()}`)
  const rawDataGroupByMouth = _.groupBy(rawData, d => `${new Date(d.Date).getUTCMonth()}`)
  console.log('rawDataGroupByMouth', rawDataGroupByMouth)
  const firstRawDataEvents = []
  eventsData.forEach(event => {
    const sum = d3.sum(rawDataGroupByEvent[event], d => d.Attendees)
    firstRawDataEvents.push({
      Event: event,
      Attendees: sum
    })
  })

  const yearRawDataMap = {}

  function getYearData() {
    years.forEach(year => {
      const yearRawDataEvents = []
      const yearRawData = rawDataGroupByYear[year]
      const yearRawDataGroupByEvent = _.groupBy(yearRawData, d => d.Event)
      eventsData.forEach(event => {
        const sum = d3.sum(yearRawDataGroupByEvent[event] || [], d => d.Attendees)
        yearRawDataEvents.push({
          Event: event,
          Attendees: sum
        })
      })
      yearRawDataMap[year] = yearRawDataEvents
    })

  }
  getYearData()

  function getMonthData(year, mouth) {
    const mouthRawData = rawDataGroupByYearMouth[`${year}-${mouth}`]
    const mouthRawDataGroupByEvent = _.groupBy(mouthRawData, d => d.Event)
    const rawData = []
    eventsData.forEach(event => {
      const sum = d3.sum(mouthRawDataGroupByEvent[event] || [], d => d.Attendees)
      rawData.push({
        Event: event,
        Attendees: Number(sum.toFixed(0))
      })
    })
    return rawData
  }

  const yAxis = g => g
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
      .data(y.ticks().reverse())
      .join("g")
      .attr("fill", "none")
      .call(g => g.append("circle")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.1)
        .attr("stroke-width", 0.1)
        .attr("r", y))
      .call(g => g.append("text")
        .attr("y", d => -y(d))
        .attr("dy", "0.35em")
        .attr("stroke-width", 5)
        .text((x, i) => {
          return x >= 1000 ? (x / 1000).toFixed(1) + 'k' : x
        })
        .clone(true)
        .attr("y", d => y(d))
        .selectAll(function () { return [this, this.previousSibling]; })
        .clone(true)
        .attr("fill", "#eee")
        .attr("stroke", "none")))

  const xAxis = g => g
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
      .data(eventsData)
      .join("g")
      .call(g => g.append("path")
        .attr("stroke", '#000')
        .attr("stroke-opacity", 0)
        .attr("d", d => `
              M${d3.pointRadial(x(d), innerRadius)}
              L${d3.pointRadial(x(d), outerRadius)}
            `))
      .call(g => g.append("path")
        .attr("id", d => d)
        .attr("fill", "none")
        .attr("d", (d, i) => {
          return `
          M${d3.pointRadial(x(d), outerRadius)}
          A${outerRadius},${outerRadius} 0,0,1 ${d3.pointRadial(i + 1 === eventsData.length ? x(eventsData[0]) : x(eventsData[i + 1]), outerRadius)}
        `
        }))
      .call(g => g.append('text')
        .attr('fill', '#eee')
        .append("textPath")
        .attr("xlink:href", d => `#${d}`)
        .text(d => d)))

  let y = d3.scalePow()
    .exponent(0.4)
    .domain(d3.extent(firstRawDataEvents, d => d.Attendees).map((d, i) => i === 1 ? d : 0))
    .range([innerRadius, outerRadius])

  const angleScale = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, eventsData.length]);

  const x = d3.scaleBand()
    .domain(eventsData)
    .range([0, 2 * Math.PI])

  const svg = d3.select(selector).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");

  svg.append("g")
    .call(xAxis);

  let yAxisG = svg.append("g")
  let lineG = svg.append('g')
  let areaG = svg.append('g')
  onGoOuter()
  function onGoOuter() {
    direction = 'inner'
    yAxisG.remove()
    console.log('firstRawDataEvents', firstRawDataEvents)
    y = d3.scalePow()
      .exponent(0.4)
      .domain([0, d3.max(firstRawDataEvents, d => d.Attendees)])
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    const areaPaths = areaG
      // .data(firstRawDataEvents)
      .append('path')
      .attr('class', 'go-outer')

 
    areaPaths.transition()
      .duration(800)
      .style('fill', d3.schemeCategory10[0])
      .style('fill-opacity', 0.5)
      .style('cursor', 'pointer')
      .attr('data-index', (d, i) => i)
      .attr("d", area
        .innerRadius(y(0))
        .outerRadius(d => {
          return y(d.Attendees)
        })
        (firstRawDataEvents))
    areaG.selectAll('path.go-years').remove()
    areaG.selectAll('path.go-month').remove()
  }


  function onClickYears(year, type) {
    clickYear = year
    const yearRawDataEvents = yearRawDataMap[year]
    yAxisG.remove()

    y = d3.scalePow()
      .exponent(0.4)
      .domain([0, d3.max(Object.values(yearRawDataMap), data => d3.max(data, d => d.Attendees))])
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    if (areaG.selectAll(`path.go-years-${type}`).size() === 1) {
      areaG.selectAll(`path.go-years-${type}`).remove()
    }



    const areaPaths = areaG
      .append('path')
      .attr('class', `go-years go-years-${type}`)

    areaPaths.transition()
      .duration(800)
      .style('fill', d3.schemeCategory10[Number(year) - 2016])
      .style('fill-opacity', 0.8)
      .style('cursor', 'pointer')
      .attr('data-year', year)
      .attr('data-mouth', (d, i) => i)
      .attr("d", area
        .innerRadius(y(0))
        .outerRadius(d => y(d.Attendees))
        (yearRawDataEvents))
    areaG.selectAll('path.go-outer').remove()
    areaG.selectAll('path.go-month').remove()
  }

  function onClickMouth(year, mouth, type) {
    const mouthRawDataEvents = getMonthData(year, mouth)
    clickMouth = mouth
    direction = 'outer'
    yAxisG.remove()

    y = d3.scalePow()
      .exponent(0.5)
      .domain([0, d3.max(Object.values(rawDataGroupByYearMouth), data => d3.max(data, d => d.Attendees))])
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    if (areaG.selectAll(`path.go-month-${type}`).size() === 1) {
      areaG.selectAll(`path.go-month-${type}`).remove()
    }

    if (!mouth) return
 const colorscheme = ["#D5C5C8", "#9DA3A4", "#604D53", "#54001c", "#DB7F8E", "#FFDBDA", "#FFB4A2"]
    const colors = {
      group1: d3.schemeCategory10[1],
      group2: d3.schemeCategory10[3],
      // group2: d3.scaleLinear(d3.schemeOrRd).domain([0, 11])
    }
    const aearPath = areaG.append('path').attr('class', `go-month go-month-${type}`)
   
    aearPath.transition()
      .duration(800)
      .style("fill", colors[type])
      // .style("fill", colorscheme[mouth])
      .style("fill-opacity", 0.5)
      .style('cursor', 'pointer')
      .attr("d", area
        .innerRadius(y(0))
        .outerRadius(d => y(d.Attendees))
        (mouthRawDataEvents))

    aearPath.on('click', function (a, d) {
      onClickYears(year)
      opts.onClickYears && opts.onClickYears(year)
    })

    areaG.selectAll('path.go-outer').remove()
    areaG.selectAll('path.go-years').remove()
  }

  const radarCartObj = {
    onGoOuter,
    onClickYears,
    onClickMouth,
    yearYAxis
  }

  function yearYAxis(year) {
    const yearRawDataEvents = getYearData(year)
    yAxisG.remove()

    y = d3.scalePow()
      .exponent(0.4)
      .domain(d3.extent(yearRawDataEvents[yearRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
      .range([innerRadius, outerRadius])
    yAxisG = svg.append("g")
      .call(yAxis);

    return radarCartObj
  }


  return radarCartObj
}

