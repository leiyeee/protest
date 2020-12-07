function waffleItemChart(selector, rawDatas) {
    const width = 400
    const height = 600
    const margin = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 50,
    }
    const eventsPadding = 20
    const eventsData = _.uniq(_.pluck(rawDatas, 'Event'))
    const innerWidth = width - (margin.left + margin.right)
    const innerHeight = height - (margin.top + margin.bottom)
    const eachRect = 3
    const eachEventRect = 3
    const eachEventRectWidth = Math.floor((innerWidth - (eachEventRect - 1) * eventsPadding) / eachEventRect)
    const eachReactWidth = eachEventRectWidth / eachRect
    let reactG

    const rawDataGroupByYear = _.groupBy(rawDatas, d => `${new Date(d.Date).getUTCFullYear()}`)

    function getMonthDate(currentYear, curMonth) {
        const rawDataGroupByMonths = _.groupBy(rawDataGroupByYear[currentYear], d => `${new Date(d.Date).getUTCMonth()}`)
        const rawDataGroupByMonth = rawDataGroupByMonths[curMonth]
        let rawDatasByMonthEvent = []
        const rawDataGroupByMonthEvent = _.groupBy(rawDataGroupByMonth, d => d.Event)
        const hasEventsData = []
        eventsData.forEach((event) => {
            const monthEventData = rawDataGroupByMonthEvent[event]
            if (monthEventData) {
                hasEventsData.push(event)
                const reduceData = _.reduce(monthEventData, function (acc, cur) {
                    const Articles = Number.parseInt(cur['Total Articles'])
                    const articelsArr = Array.from({
                            length: Articles
                        })
                        .map(() => ({
                            ...cur,
                            'Total Articles': 1
                        }))
                    return [...acc, ...articelsArr]
                }, [])
                rawDatasByMonthEvent = [...rawDatasByMonthEvent, ...reduceData]
            }
        })
        return {
            rawDatasByMonthEvent,
            hasEventsData
        }
    }

    const colors = d3.scaleOrdinal()
        .domain(eventsData)
        .range(["#D5C5C8", "#9DA3A4", "#604D53", "#54001c", "#DB7F8E", "#FFDBDA", "#FFB4A2"])

    const svg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");


    reactG = svg.append('g')

    return {
        update: function (currentYear = 2017, currentMonth = 6) {
            const {
                rawDatasByMonthEvent,
                hasEventsData
            } = getMonthDate(currentYear, currentMonth)
            const rawDatasGroupByEvent = _.groupBy(rawDatasByMonthEvent, d => d.Event)
            const hasLines = Math.ceil(hasEventsData.length / eachEventRect)
            const eachEventRectHeight = Math.floor((innerHeight - (hasLines - 1) * eventsPadding) / hasLines)
            const getTranslateX = (index) => index * (eachEventRectWidth + eventsPadding)
            const getTranslateY = (index) => Math.floor(index / eachEventRect) * (eachEventRectHeight + eventsPadding)
            const eachReactHeight = eachEventRectHeight / Math.ceil(rawDatasByMonthEvent.length / eachRect)

            const y = d3.scaleLinear()
                .domain([Math.ceil(rawDatasByMonthEvent.length / eachRect), 0])
                .range([0, eachEventRectHeight])

            reactG.selectAll('g').remove()
            reactG.selectAll('g')
                .data(hasEventsData)
                .join('g')
                .attr('class', d => `event-${d.replace(' ', '')}`)
                .attr('transform', (d, i) => `translate(${getTranslateX(i % eachEventRect)}, ${getTranslateY(i)})`)
                .selectAll('rect')
                .data(rawDatasByMonthEvent)
                .join('rect')
                .attr('height', eachReactHeight)
                .attr('width', eachReactWidth)
                .attr('stroke', '#fff')
                .style('cursor', 'pointer')
                .attr('stroke-width', 0.5)
                .attr('fill', '#eee')
                .attr('x', (d, i) => i % eachRect * eachReactWidth)
                .attr('y', (d, i) => y(Math.floor(i / eachRect)))

            Object.keys(rawDatasGroupByEvent).forEach(Event => {
                const rawData = rawDatasGroupByEvent[Event]
                const className = `event-${Event.replace(' ', '')}`
                d3.selectAll(`.${className} rect`)
                    .attr('fill', (d, i) => i < rawData.length ? colors(Event) : '#eee')
                    .append('title')
                    .text((d, i) => i < rawData.length ? d.Source : '')
            })

        },
        remove() {
            reactG.selectAll('g').remove()

        }
    }
}
