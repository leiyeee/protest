function radarChart(selector, rawData, opts) {
  const width = 500
  const height = width
  const margin = 10
  const outerRadius = width / 2 - margin
  const innerRadius = width / 10
  options = {
    ...opts,
    xStroke: '#000'
  }
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

  let direction = 'inner'
  let clickYear = ''
  let clickMouth = ''
  const eventsData = _.uniq(_.pluck(rawData, 'Event'))
  const rawDataGroupByEvent = _.groupBy(rawData, d => d.Event)
  const rawDataGroupByYear = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}`)
  const rawDataGroupByYearMouth = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}-${new Date(d.Date).getUTCMonth()}`)
  const firstRawDataEvents = []
  Array.from({ length: 4 }).forEach((d, i) => {
    const rawData = []
    eventsData.forEach(event => {
      const sum = d3.sum(rawDataGroupByEvent[event], d => d.Attendees)
      rawData.push({
        Event: event,
        Attendees: Number((sum * (i + 1) / 4).toFixed(0))
      })
    })
    firstRawDataEvents.push(rawData)
  })

  function getYearData(year) {
    const yearRawDataEvents = []
    const yearRawData = rawDataGroupByYear[year]
    const yearRawDataGroupByEvent = _.groupBy(yearRawData, d => d.Event)
    const num = 12
    Array.from({ length: num }).forEach((d, i) => {
      const rawData = []
      eventsData.forEach(event => {
        const sum = d3.sum(yearRawDataGroupByEvent[event] || [], d => d.Attendees)
        rawData.push({
          Event: event,
          Attendees: Number((sum * (i + 1) / num).toFixed(0))
        })
      })
      yearRawDataEvents.push(rawData)
    })
    return yearRawDataEvents
  }
  function getMouthData(year, mouth) {
    // const mouthRawDataEvents = []
    const mouthRawData = rawDataGroupByYearMouth[`${year}-${mouth}`]
    const mouthRawDataGroupByEvent = _.groupBy(mouthRawData, d => d.Event)
    const num = 12
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
        .attr("fill", "red")
        .attr("stroke", "none")))

  const xAxis = g => g
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .call(g => g.selectAll("g")
      .data(eventsData)
      .join("g")
      .call(g => g.append("path")
        .attr("stroke", options.xStroke)
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
        .attr('fill', '#ff6666')
        .append("textPath")
        .attr("xlink:href", d => `#${d}`)
        .text(d => d)))

  let y = d3.scalePow()
    .exponent(0.4)
    .domain(d3.extent(firstRawDataEvents[firstRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
    .range([innerRadius, outerRadius])
  const radiusScale = d3.scalePow()
    .exponent(0.4)
    .domain(d3.extent(firstRawDataEvents[firstRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
    .range([innerRadius, outerRadius])
  const angleScale = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .domain([0, eventsData.length]);

  const x = d3.scaleBand()
    .domain(eventsData)
    .range([0, 2 * Math.PI])

  let colors = (e) => {
    const d = d3.scaleBand()
      .domain([0, 2])
      .range([0, 1])(e)
    return d3.interpolateSinebow(d)
  }

  const colorInterpolator = d3.interpolateRgb(d3.color("#ff6666"), d3.color("#8293b6"));

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
    // areaG.selectAll('path').remove()
    const colorScheme = d3.quantize(colorInterpolator, firstRawDataEvents.length);

    colors = (e) => {
      const d = d3.scaleBand()
        .domain([0, 2])
        .range([0, 1])(e)
      return d3.interpolateSinebow(d)
    }
    y = d3.scalePow()
      .exponent(0.4)
      .domain(d3.extent(firstRawDataEvents[firstRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    const areaPaths = areaG.selectAll('path')
      .data(firstRawDataEvents)
      .join('path')
      .attr('class', 'go-outer')


    areaPaths.transition()
      .duration(800)
      .style('fill', (d, i) => colorScheme[i])
      .style('fill-opacity', 0.8)
      .style('cursor', 'pointer')
      .attr('data-index', (d, i) => i)
      .attr("d", (od, i) => {
        return area
          .innerRadius((d, j) => {
            if (i === 0) return y(0)
            return y(firstRawDataEvents[i - 1][j].Attendees)
          })
          .outerRadius(d => {
            return y(d.Attendees)
          })
          (od)
      })

    areaPaths.on('mouseover', function () {
      d3.select(this)
        .style("fill", '#fff')
    })
      .on('mouseout', function (e, d) {
        d3.select(this)
          .style("fill", colorScheme[Number(d3.select(this).attr('data-index'))])
      })
      .on('click', function (a, d) {
        const year = 2017 + Number(d3.select(this).attr('data-index'))
        onClickYears(year)
        opts.onClickYears && opts.onClickYears(year)
      })

    areaG.selectAll('path.go-years').remove()
    areaG.selectAll('path.go-month').remove()

  }


  function onClickYears(year) {
    clickYear = year
    const yearRawDataEvents = getYearData(year)
    const colorScheme = d3.quantize(colorInterpolator, yearRawDataEvents.length);
    yAxisG.remove()

    y = d3.scalePow()
      .exponent(0.4)
      .domain(d3.extent(yearRawDataEvents[yearRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
      .range([innerRadius, outerRadius])

    colors = (e) => {
      const d = d3.scaleBand()
        .domain(Array.from({ length: yearRawDataEvents.length }).map((d, i) => i))
        .range([0, 1])(e)
      return d3.interpolateSinebow(d)
    }
    yAxisG = svg.append("g")
      .call(yAxis);

    const areaPaths = areaG.selectAll('path')
      .data(yearRawDataEvents)
      .join('path')
      .attr('class', 'go-years')

    areaPaths.transition()
      .duration(800)
      .style('fill', (d, i) => colorScheme[i])
      .style('fill-opacity', 0.8)
      .style('cursor', 'pointer')
      .attr('data-year', year)
      .attr('data-mouth', (d, i) => i)
      .attr("d", (od, i) => {
        return area
          .innerRadius((d, j) => {
            if (i === 0) return y(0)
            return y(yearRawDataEvents[i - 1][j].Attendees)
          })
          .outerRadius(d => y(d.Attendees))
          (od)
      })

    areaPaths.on('mouseover', function () {
      d3.select(this)
        .style("fill", '#fff')
    })
      .on('mouseout', function (e, d) {
        d3.select(this)
          .style("fill", colorScheme[d3.select(this).attr('data-mouth')])
      })
      .on('click', function (a, d) {
        if (direction === 'outer') {
          onGoOuter()
          opts.onClickGoOut && opts.onClickGoOut(d3.select(this).attr('data-year'), d3.select(this).attr('data-mouth'))
        } else {
          onClickMouth(d3.select(this).attr('data-year'), d3.select(this).attr('data-mouth'))
          opts.onClickMouth && opts.onClickMouth(d3.select(this).attr('data-year'), d3.select(this).attr('data-mouth'))
        }
      })
    areaG.selectAll('path.go-outer').remove()
    areaG.selectAll('path.go-month').remove()
  }
  // onClickMouth(2017, 0)
  function onClickMouth(year, mouth) {
    const mouthRawDataEvents = getMouthData(year, mouth)
    const colorScheme = d3.quantize(colorInterpolator, 0);

    clickMouth = mouth
    direction = 'outer'
    yAxisG.remove()

    y = d3.scalePow()
      .exponent(0.5)
      .domain([0, d3.max(mouthRawDataEvents, d => d.Attendees)])
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    const aearPath = areaG.append('path').attr('class', 'go-month')

    aearPath.transition()
      .duration(800)
      .style("fill", '#ff6666')
      .style("fill-opacity", 0.8)
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

}

