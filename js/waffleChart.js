function waffleChart(selector, rawDatas) {
    const width = 600
    const height = width
    const margin = {
        top: 30,
        bottom: 30,
        left: 30,
        right: 50,
    }
    const yearsPadding = 10
    const eventsData = _.uniq(_.pluck(rawDatas, 'Event'))
    const rawDataGroupByYear = _.groupBy(rawDatas, d => `${new Date(d.Date).getUTCFullYear()}`)
    const innerWidht = width - (margin.left + margin.right) * 2
    const innerHeight = height - (margin.top + margin.bottom) * 2
    const eachLineNum = 2
    let textG, rectG, legendG

    const colors = d3.scaleOrdinal()
        .domain(eventsData)
        .range([...d3.schemeCategory10, ...d3.schemeTableau10])

    const legend = d3.legendColor()
        .cells(eventsData)
        .scale(colors)

    const svg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

    function getMonthDate(curYear) {
        const rawDataGroupByMonth = _.groupBy(rawDataGroupByYear[curYear], d => `${new Date(d.Date).getUTCMonth()}`)
        const rawDatasByMonthEvent = []

        const months = Object.keys(rawDataGroupByMonth).sort((a, b) => Number(a) - Number(b))
        months.forEach((m) => {
            const rawDataGroupByMonthEvent = _.groupBy(rawDataGroupByMonth[m], d => d.Event)
            let rawData = []
            eventsData.forEach((event) => {
                const monthEventData = rawDataGroupByMonthEvent[event]
                if (monthEventData) {
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
                    rawData = [...rawData, ...reduceData]
                }
            })
            rawDatasByMonthEvent.push(rawData)
        })
        return {
            rawDatasByMonthEvent,
            months
        }
    }

    textG = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.top})`)

    rectG = svg.append('g')
        .attr('transform', `translate(${margin.left / 2 + 6}, ${margin.top + 20})`)

    legendG = svg.append('g')
        .attr('transform', `translate(${width - margin.right - 70}, 0) scale(0.6, 0.6) `)

    return {
        update: function (currentYear = 2017) {
            const {
                rawDatasByMonthEvent,
                months
            } = getMonthDate(currentYear)
            const yearRectWidth = Math.floor((innerWidht - (months.length - 1) * yearsPadding) / months.length)
            const eachReactWidth = Math.floor(yearRectWidth / eachLineNum)
            const getTranslate = (index) => index * (yearRectWidth + yearsPadding)
            const maxSteps = d3.max(rawDatasByMonthEvent, d => Math.ceil(d.length / eachLineNum))
            const y = d3.scaleLinear()
                .domain([maxSteps, 0])
                .range([0, innerHeight])

            textG.selectAll('text').remove()
            rectG.selectAll('g').remove()
            legendG.selectAll('g').remove()

            textG.selectAll('text')
                .data(months)
                .join('text')
                .attr('transform', (d, i) => `translate(${getTranslate(i)}, 0)`)
                .attr('fill', '#eee')
                .attr('stroke', '#eee')
                .text(d => Number(d) + 1)

            const eachReact = rectG.selectAll('path')
                .data(rawDatasByMonthEvent)
                .join('g')
                .attr('transform', (d, i) => `translate(${getTranslate(i)}, 0)`)
                .selectAll('rect')
                .data(d => d)
                .join('rect')
                .style('cursor', 'pointer')
                .attr('width', eachReactWidth)
                .attr('height', Math.floor(innerHeight / maxSteps))
                .attr('stroke', '#fff')
                .attr('fill', '#eee')
                .attr('stroke-width', 0.5)


            eachReact.attr('fill', d => colors(d.Event))
                .attr('x', (d, i) => i % eachLineNum * eachReactWidth)
                .attr('y', (d, i) => y(Math.floor(i / eachLineNum)))
                .append('title')
                .text(d => d.Source)

            legendG.call(legend).call(g => g.selectAll('text.label').attr('fill', '#eee'))

        },
        remove() {
            textG.selectAll('text').remove()
            rectG.selectAll('g').remove()
            legendG.selectAll('g').remove()
        }
    }

}
