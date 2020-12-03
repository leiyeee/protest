(async function () {
  let protestsData = await d3.csv('./data/protests.csv')
  protestsData = protestsData.map(d => ({
    ...d,
    ['Event (legacy; see tags)']: d['Event (legacy; see tags)'].replace(/\(.*\)/gi, '').trim()
  }))

  const protestsDataGroupByMouthAndEvent = _.groupBy(protestsData, d => {
    const date = new Date(d.Date)
    return `${date.getUTCFullYear()}-${date.getUTCMonth() < 9 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1}-${d['Event (legacy; see tags)']}`
  })

  const rawData = Object.keys(protestsDataGroupByMouthAndEvent).map(key => {
    const Attendees = d3.sum(protestsDataGroupByMouthAndEvent[key], d => Number(d.Attendees))

    const date = new Date(protestsDataGroupByMouthAndEvent[key][0].Date)
    return {
      ...protestsDataGroupByMouthAndEvent[key][0],
      Event: protestsDataGroupByMouthAndEvent[key][0]['Event (legacy; see tags)'],
      Date: `${date.getUTCFullYear()}-${date.getUTCMonth() < 9 ? '0' + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1}`,
      Attendees,
      Total: d3.sum(protestsDataGroupByMouthAndEvent[key], d => Number(d['Total Articles']))
    }

  })
  const eventsData = _.uniq(_.pluck(rawData, 'Event'))
  const getEventsData = (data = {}, lastSeriesEventData = []) => {
    const eventData = []
    const seriesEventData = []
    eventsData.forEach((event, i) => {
      const dataEvent = data[event] || []
      const sumData = d3.sum(dataEvent, d => d.Attendees)
      eventData.push({
        Event: event,
        Attendees: sumData,
      })
      seriesEventData.push({
        Event: event,
        Attendees: sumData + (lastSeriesEventData[i] && lastSeriesEventData[i].Attendees || 0),
      })
    })

    return {
      eventData,
      seriesEventData
    }
  }

  const rawDataGroupByYear = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}`)
  const rawDataGroupByYearArr = []
  const years = []
  const rawDataGroupByEvent = _.groupBy(rawData, d => d.Event)
  const rawDataEvents = []
  Array.from({ length: 4 }).forEach((d, i) => {
    const rawData = []
    eventsData.forEach(event => {
      const sum = d3.sum(rawDataGroupByEvent[event], d => d.Attendees)
      rawData.push({
        Event: event,
        Attendees: Number((sum * (i + 1) / 4).toFixed(0))
      })
    })
    rawDataEvents.push(rawData)
  })

  Object.keys(rawDataGroupByYear).sort((a, b) => Number(a) - Number(b)).forEach((year, i) => {
    let lastData = rawDataGroupByYearArr[i - 1] || []
    years.push(year)
    const data = rawDataGroupByYear[year]
    const groupByEventData = _.groupBy(data, (d) => d.Event)
    const { eventData, seriesEventData } = getEventsData(groupByEventData, lastData.seriesEventData)
    const groupByMouthData = _.groupBy(data, (d) => `${new Date(d.Date).getUTCMonth()}`)
    const mouthEventsData = []
    Array.from({ length: 12 }).forEach((d, index) => {
      if (!groupByMouthData[index]) return
      mouthEventsData.push(groupByMouthData[index])
    })

    rawDataGroupByYearArr.push({
      seriesEventData: seriesEventData,
      eventsData: eventData,
      mouthEventsData,
      year
    })
  })

  let yearOptions = `<option></option>`
  years.forEach(year => {
    yearOptions = yearOptions + `<option value="${year}">${year}</option>`
  })

  document.querySelector('select.group1-select-years').innerHTML = yearOptions
  // document.querySelector('select.group2-select-years').innerHTML = yearOptions
  let currentYear = null
  const radarChartItem = radarChart('#radar-chart', rawData)
  window.onSelectGroup1Year = function (val) {
    d3.select('#waffle-chart svg').remove()
    d3.select('#waffle-item-chart svg').remove()
    currentYear = val
    if (!val) {
      radarChartItem.onGoOuter()
      document.querySelector('select.group1-select-month').innerHTML = '<option></option>'
      return
    }
    radarChartItem.onClickYears(val)

    waffleChart('#waffle-chart', rawData).update(val)
    let monthOptions = `<option></option>`
    Array.from({ length: 12 }).forEach((t, i) => {
      monthOptions = monthOptions + `<option value="${i}">${i + 1}</option>`
    })
    document.querySelector('select.group1-select-month').innerHTML = monthOptions

  }

  window.onSelectGroup1Month = function (val) {
    d3.select('#waffle-chart svg').remove()
    d3.select('#waffle-item-chart svg').remove()
    if (!val) {
      radarChartItem.onClickYears(currentYear)

      waffleChart('#waffle-chart', rawData).update(currentYear)
      return
    }
    radarChartItem.onClickMouth(currentYear, val)
    waffleItemChart('#waffle-item-chart', rawData).update(currentYear, val)
  }


  window.onSelectGroup2Year = function (val) {
    radarChartItem.onClickYears(val)

  }
})()