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
  const area = d3.areaRadial()
    .curve(d3.curveBasis)
    .angle(d => x(d.Event))

  const line = d3.lineRadial()
    .curve(d3.curveBasis)
    .angle(d => x(d.Event))

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
  console.log('rawDataGroupByYearMouth', rawDataGroupByYearMouth)
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
        .attr("stroke-opacity", 0.2)
        .attr("r", y))
      .call(g => g.append("text")
        .attr("y", d => -y(d))
        .attr("dy", "0.35em")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        // .text((x, i) => `${x.toFixed(0)}`)
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
      // .each((d, i) => d.id = guid())
      .call(g => g.append("path")
        .attr("stroke", options.xStroke)
        // .attr("stroke-width", "3")
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
        .append("textPath")
        .attr("xlink:href", d => `#${d}`)
        .text(d => d)))
  let y = d3.scaleLinear()
    .domain(d3.extent(firstRawDataEvents[firstRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
    .range([innerRadius, outerRadius])

  const x = d3.scaleBand()
    .domain(eventsData)
    .range([0, 2 * Math.PI])

  let colors = (e) => {
    const d = d3.scaleBand()
      .domain([0, 2])
      .range([0, 1])(e)
    return d3.interpolateSinebow(d)
  }

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
    lineG.selectAll('path').remove()
    areaG.selectAll('path').remove()

    colors = (e) => {
      const d = d3.scaleBand()
        .domain([0, 2])
        .range([0, 1])(e)
      return d3.interpolateSinebow(d)
    }
    y = d3.scaleLinear()
      .domain(d3.extent(firstRawDataEvents[firstRawDataEvents.length - 1], d => d.Attendees).map((d, i) => i === 1 ? d : 0))
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    lineG.selectAll('path')
      .data(firstRawDataEvents)
      .join('path')
      .attr("fill", "none")
      .attr("stroke", '#000')
      .attr("stroke-width", 0.5)
      .attr("d", (od, i) => {
        return line
          .radius((d, j) => {
            return y(d.Attendees)
          })(od)
      })

    areaG.selectAll('path')
      .data(firstRawDataEvents)
      .join('path')
      .attr("fill", (d) => colors(d.year))
      .attr("fill-opacity", 0.2)
      .attr('data-index', (d, i) => i)
      .attr("d", (od, i) => {
        return area
          .innerRadius((d, j) => {
            if (i === 0) return y(0)
            return y(firstRawDataEvents[i - 1][j].Attendees)
          })
          .outerRadius(d => y(d.Attendees))
          (od)
      })
      .on('mouseover', function () {
        d3.select(this)
          .attr("fill", '#fff')
      })
      .on('mouseout', function (e, d) {
        d3.select(this)
          .attr("fill", colors(d.year))
      })
      .on('click', function (a, d) {
        const year = 2017 + Number(d3.select(this).attr('data-index'))
        onClickYears(year)
      })
  }


  function onClickYears(year) {
    clickYear = year
    const yearRawDataEvents = getYearData(year)
    console.log('yearRawDataEvents', yearRawDataEvents)
    yAxisG.remove()
    lineG.selectAll('path').remove()
    areaG.selectAll('path').remove()

    y = d3.scaleLinear()
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

    lineG.selectAll('path')
      .data(yearRawDataEvents)
      .join('path')
      .attr("fill", "none")
      .attr("stroke", '#000') // 
      .attr("stroke-width", 0.5)
      .attr("d", (od, i) => {
        return line
          .radius((d, j) => {
            return y(d.Attendees)
          })(od)
      })

    areaG.selectAll('path')
      .data(yearRawDataEvents)
      .join('path')
      .attr("fill", (d) => {
        return colors(d[0].mouth)
      })
      .attr('data-year', year)
      .attr('data-mouth', (d, i) => i)
      .attr("fill-opacity", 0.2)
      .attr("d", (od, i) => {
        return area
          .innerRadius((d, j) => {
            if (i === 0) return y(0)
            return y(yearRawDataEvents[i - 1][j].Attendees)
          })
          .outerRadius(d => y(d.Attendees))
          (od)
      })
      .on('mouseover', function () {
        d3.select(this)
          .attr("fill", '#fff')
      })
      .on('mouseout', function (e, d) {
        d3.select(this)
          .attr("fill", colors(d[0].mouth))
      })
      .on('click', function (a, d) {
        console.log('d', d3.select(this).attr('data-year'))
        if (direction === 'outer') {
          onGoOuter()
        } else {
          onClickMouth(d3.select(this).attr('data-year'), d3.select(this).attr('data-mouth'))
        }
      })
  }

  function onClickMouth(year, mouth) {
    const mouthRawDataEvents = getMouthData(year, mouth)
    console.log('getMouthData', getMouthData(year, mouth))
    clickMouth = mouth
    direction = 'outer'
    yAxisG.remove()
    lineG.selectAll('path').remove()
    areaG.selectAll('path').remove()

    y = d3.scaleLinear()
      // .domain(d3.extent(mouthRawDataEvents, d => d.Attendees).map((d, i) => i === 1 ? d : 0))
      .domain([0, d3.max(mouthRawDataEvents, d => d.Attendees)])
      .range([innerRadius, outerRadius])

    yAxisG = svg.append("g")
      .call(yAxis);

    lineG.append('path')
      .attr("fill", "none")
      .attr("stroke", '#000') // 
      .attr("stroke-width", 0.5)
      .attr("d", line
        .radius((d) => {
          return y(d.Attendees)
        })(mouthRawDataEvents))

    areaG.append('path')
      .attr("fill", 'red')
      .attr("fill-opacity", 0.2)
      .attr("d", area
        .innerRadius(y(0))
        .outerRadius(d => y(d.Attendees))
        (mouthRawDataEvents))
      .on('click', function (a, d) {
        onClickYears(year)
      })
  }




}

