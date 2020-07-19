const scrapeIt = require("scrape-it")
const fs = require("fs")

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
      avg: rcpAvg,
    })
  }
  pollNumbers = pollNumbers.filter((x) => x.avg !== null)
  const data = JSON.parse(fs.readFileSync(`src/data/data.json`))
  pollNumbers.forEach((x) => {
    const foundIndex = data.states.findIndex((y) => y.state === x.state)
    // update rcpAvg on existing
    if (foundIndex !== -1) {
      data.states[foundIndex] = { ...data.states[foundIndex], avg: x.avg }
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
  fs.writeFileSync(`src/data/data.json`, JSON.stringify(data, undefined, 2))

  console.log(data)
}

init()
