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

  const rawDataGroupByYear = _.groupBy(rawData, d => `${new Date(d.Date).getUTCFullYear()}`)
  let years = []
  years = Object.keys(rawDataGroupByYear).sort((a, b) => Number(a) - Number(b))

  let yearOptions = `<option></option>`
  years.forEach(year => {
    yearOptions = yearOptions + `<option value="${year}">${year}</option>`
  })

  document.querySelector('select.group1-select-years').innerHTML = yearOptions
  document.querySelector('select.group2-select-years').innerHTML = yearOptions
  let currentGroup1Year = null
  let currentGroup2Year = null
  let currentGroup1Month = null
  let currentGroup2Month = null

  const radarChartItem = radarChart('#radar-chart', rawData, years)
  window.onSelectGroup1Year = function (val) {
    d3.select('#waffle-chart svg').remove()
    d3.select('#waffle-item-chart svg').remove()
    currentGroup1Year = val
    currentGroup1Month = null
    radarChartItem.onClickMouth(currentGroup1Year, '', 'group1')

    if (!val) {
      if (getMonthYears() && getMonthStatus()) {
        radarChartItem.onGoOuter()
      }
      // radarChartItem.onClickMouth(currentGroup1Year, '', 'group1')

      document.querySelector('select.group1-select-month').innerHTML = '<option></option>'
      return
    }
    if (getMonthStatus()) {
      radarChartItem.onClickYears(val, 'group1')
    }

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
    currentGroup1Month = val
    if (!val) {
      if (getMonthStatus()) {
        radarChartItem.onClickYears(currentGroup1Year, 'group1')
        return
      }
      waffleChart('#waffle-chart', rawData).update(currentGroup1Year)
    }
    radarChartItem.onClickMouth(currentGroup1Year, val, 'group1')
    waffleItemChart('#waffle-item-chart', rawData).update(currentGroup1Year, val)
  }


  window.onSelectGroup2Year = function (val) {
    d3.select('#waffle-chart-2 svg').remove()
    d3.select('#waffle-item-chart-2 svg').remove()
    radarChartItem.onClickMouth(currentGroup2Year, '', 'group2')
    currentGroup2Year = val
    currentGroup2Month = null
    if (!val) {
      if (getMonthYears() && getMonthStatus()) {
        radarChartItem.onGoOuter()
      }
      document.querySelector('select.group2-select-month').innerHTML = '<option></option>'
      return
    }

    if (getMonthStatus()) {
      radarChartItem.onClickYears(val, 'group2')
    }

    waffleChart('#waffle-chart-2', rawData).update(val)
    let monthOptions = `<option></option>`
    Array.from({ length: 12 }).forEach((t, i) => {
      monthOptions = monthOptions + `<option value="${i}">${i + 1}</option>`
    })
    document.querySelector('select.group2-select-month').innerHTML = monthOptions

  }

  window.onSelectGroup2Month = function (val) {
    d3.select('#waffle-chart-2 svg').remove()
    d3.select('#waffle-item-chart-2 svg').remove()
    currentGroup2Month = val
    if (!val) {
      if (getMonthStatus()) {
        radarChartItem.onClickYears(currentGroup2Year, 'group2')
        return
      }
      waffleChart('#waffle-chart-2', rawData).update(currentGroup2Year)
      // return
    }
    radarChartItem.onClickMouth(currentGroup2Year, val, 'group2')
    waffleItemChart('#waffle-item-chart-2', rawData).update(currentGroup2Year, val)
  }

  function getMonthStatus() {
    return Number.parseInt(currentGroup1Month) !== 0 && !currentGroup1Month && Number.parseInt(currentGroup2Month) !== 0 && !currentGroup2Month
  }

  function getMonthYears() {
    return !currentGroup1Year && !currentGroup2Year
  }
})()