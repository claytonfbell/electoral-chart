const scrapeIt = require("scrape-it")
const fs = require("fs")
const moment = require("moment")
const countryRegionData = require("country-region-data")
const axios = require("axios")

console.log(countryRegionData)

// Promise interface
async function init() {
  const statePollLinks = await scrapeIt(
    "https://www.realclearpolitics.com/epolls/2020/president/2020_elections_electoral_college_map.html",
    {
      links: {
        listItem: "a",
        data: {
          link: {
            attr: "href",
          },
        },
      },
    }
  ).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)

    // filter and map it into unique state poll links
    return [
      ...new Set(
        data.links
          .filter((x) => x.link.match(/2020\/president\/[a-z]{2}\//) !== null)
          .map((x) => x.link)
      ),
    ]
  })

  console.log(statePollLinks)
  let pollNumbers = []
  for (let i = 0; i < statePollLinks.length; i++) {
    const rcpAvg = await scrapeIt(
      `https://www.realclearpolitics.com${statePollLinks[i]}`,
      {
        avg: {
          selector: ".rcpAvg",
          convert: (x) => {
            if (x.match(/Tie/) !== null) {
              return 0
            }
            const m = x.match(/(Biden|Trump) \+([0-9.]+)/)
            if (m !== null) {
              const avg = m[2] === "Tie" ? 0 : Number(m[2])
              return m[1] === "Biden" ? avg : -1 * avg
            } else {
              return null
            }
          },
        },
      }
    ).then(({ data, response }) => {
      // console.log(`Status Code: ${response.statusCode}`)
      // console.log(data)
      return data.avg
    })
    const state = statePollLinks[i].match(/2020\/president\/([a-z]{2})\//)[1]
    console.log(`${state} ${rcpAvg}`)
    pollNumbers.push({
      state: state.toUpperCase(),
      rcpAvg,
      rcpUpdatedAt: moment().toISOString(),
    })
  }
  pollNumbers = pollNumbers.filter((x) => x.avg !== null)
  const data = JSON.parse(fs.readFileSync(`src/data/data.json`))
  pollNumbers.forEach((x) => {
    const foundIndex = data.states.findIndex((y) => y.state === x.state)
    // update rcpAvg on existing
    if (foundIndex !== -1) {
      data.states[foundIndex] = {
        ...data.states[foundIndex],
        rcpAvg: x.rcpAvg !== null ? x.rcpAvg : undefined,
        rcpUpdatedAt: x.rcpUpdatedAt,
      }
    }
    // add new state
    else {
      data.states.push(x)
    }
  })
  data.states.sort((a, b) => {
    if (a.state < b.state) {
      return -1
    }
    if (a.state > b.state) {
      return 1
    }
    return 0
  })
  data.states = data.states.map((x) => {
    const region = countryRegionData
      .find((y) => y.countryShortCode === "US")
      .regions.find((y) => y.shortCode === x.state)
    const { avg, lastUpdate, ...z } = x
    return { ...z, stateName: region.name }
  })

  // five thirty eight
  for (let i = 0; i < data.states.length; i++) {
    if (!data.states[i].skipFte) {
      const url = `https://projects.fivethirtyeight.com/polls/president-general/${data.states[
        i
      ].stateName
        .toLowerCase()
        .replace(/ /g, "-")}/polling-average.json`
      const result = await axios
        .get(url)
        .then((resp) => resp.data)
        .catch(() => {
          return null
        })
      if (result !== null) {
        const a = result.slice(0, 2)
        const biden = a.find((x) => x.candidate.indexOf("Biden") !== -1)
          .pct_trend_adjusted

        const trump = a.find((x) => x.candidate.indexOf("Trump") !== -1)
          .pct_trend_adjusted
        const fteAvg = biden - trump
        data.states[i].fteAvg = Number(fteAvg.toFixed(2))
        data.states[i].fteUpdatedAt = moment().toISOString()
      } else {
        console.log(`Failed ${url}`)
        data.states[i].skipFte = true
      }
    }
  }

  data.lastUpdate = moment().toISOString()
  fs.writeFileSync(`src/data/data.json`, JSON.stringify(data, undefined, 2))
  console.log(data)
}

init()
