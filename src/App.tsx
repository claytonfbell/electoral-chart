import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline"
import Grid from "@material-ui/core/Grid/Grid"
import { ThemeProvider } from "@material-ui/core/styles"
import { fade } from "@material-ui/core/styles/colorManipulator"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import Typography from "@material-ui/core/Typography/Typography"
import CheckIcon from "@material-ui/icons/Check"
import moment from "moment"
import React from "react"
import Battleground from "./Battleground"
import data from "./data/data.json"
import FavorSlider from "./FavorSlider"

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
  },
  state: {
    borderRight: `1px solid #ccc`,
    borderTop: `1px solid #aaa`,
    borderBottom: `1px solid #aaa`,
    display: "inline-block",
    minHeight: 96,
  },
  divided: { width: "50%", borderRight: `2px dashed #333` },
}))

export const blue = `#0077cf`
export const red = `#c82333`

export function displaySpread(row: State) {
  return row.avg === 0
    ? `Tie`
    : row.avg > 0
    ? `Biden +${row.avg.toFixed(1)}%`
    : `Trump +${(row.avg * -1).toFixed(1)}%`
}

export type State = {
  state: string
  avg: number
  votes: number
}

function App() {
  const classes = useStyles()

  const votePct = (votes: number) => 100 * ((votes || 0) / 538)

  function calculateColor(row: State) {
    let color = row.avg === 0 ? "#ccc" : row.avg > 0 ? blue : red

    const spread = Math.min(33, row.avg > 0 ? row.avg : row.avg * -1)
    color = fade(color, spread / 33)
    return color
  }

  // adjust number per favor slider
  const [favor, setFavor] = React.useState(0)
  const states = data.states.map((x) => ({
    ...x,
    avg: favor * -1 + Math.max(-33, Math.min(33, x.avg)),
  }))

  const bidenVotes = states.reduce((a, b) => a + (b.avg > 0 ? b.votes : 0), 0)
  const trumpVotes = states.reduce((a, b) => a + (b.avg < 0 ? b.votes : 0), 0)

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: `#0077cf`,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Grid
          container
          style={{ marginTop: 64, width: "100%" }}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Grid container justify="space-between">
              <Grid item className={classes.divided}>
                <Typography style={{ color: blue }} variant="h5">
                  Biden {bidenVotes}
                  {bidenVotes >= 270 && (
                    <CheckIcon fontSize="inherit" color="inherit" />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{ color: red }} variant="h5">
                  Trump {trumpVotes}
                  {trumpVotes >= 270 && (
                    <CheckIcon fontSize="inherit" color="inherit" />
                  )}
                </Typography>
              </Grid>
            </Grid>

            {states
              .sort((a, b) => b.avg - a.avg)
              .map((row) => (
                <Tooltip
                  key={row.state}
                  title={`${row.state} ${
                    row.avg >= 33 || row.avg <= -33 ? "" : displaySpread(row)
                  }`}
                >
                  <div
                    className={classes.state}
                    style={{
                      backgroundColor: calculateColor(row),
                      width: `${votePct(row.votes)}%`,
                    }}
                  ></div>
                </Tooltip>
              ))}
            <Grid container justify="center">
              <Grid item>
                <FavorSlider value={favor} onChange={(v) => setFavor(v)} />
                <br />
                <br />
                <Typography variant="caption" component="div" align="center">
                  Last Updated {moment(data.lastUpdate).format("llll")}
                </Typography>
                <Battleground states={states} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
