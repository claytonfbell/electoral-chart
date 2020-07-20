import { Link } from "@material-ui/core"
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
import TossupSlider from "./TossupSlider"

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
  dividerContainer: {
    position: "relative",
  },
  divider: {
    position: "absolute",
    borderRight: `2px dashed #999`,
    minHeight: 96,
    width: `50%`,
  },
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

  const [tossup, setTossup] = React.useState(0)
  const votePct = React.useCallback(
    (votes: number) => 100 * ((votes || 0) / 538),
    []
  )

  const calculateColor = React.useCallback(
    (row: State) => {
      let color =
        row.avg >= -tossup && row.avg <= tossup
          ? "#ccc"
          : row.avg > 0
          ? blue
          : red

      const spread = Math.min(33, row.avg > 0 ? row.avg : row.avg * -1)
      color = fade(color, spread / 33)
      return color
    },
    [tossup]
  )

  // adjust number per favor slider
  const [favor, setFavor] = React.useState(0)
  const states = React.useMemo(
    () =>
      data.states.map((x) => ({
        ...x,
        avg: favor * -1 + Math.max(-33, Math.min(33, x.avg)),
      })),
    [favor]
  )

  const bidenVotes = React.useMemo(
    () => states.reduce((a, b) => a + (b.avg > tossup ? b.votes : 0), 0),
    [states, tossup]
  )

  const trumpVotes = React.useMemo(
    () => states.reduce((a, b) => a + (b.avg < -tossup ? b.votes : 0), 0),
    [states, tossup]
  )

  const tossupVotes = React.useMemo(
    () =>
      states.reduce(
        (a, b) => a + (b.avg >= -tossup && b.avg <= tossup ? b.votes : 0),
        0
      ),
    [states, tossup]
  )

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
              <Grid item>
                <Typography style={{ color: blue }} variant="h5">
                  Biden {bidenVotes}
                  {bidenVotes >= 270 && (
                    <CheckIcon
                      style={{ marginBottom: -4 }}
                      fontSize="inherit"
                      color="inherit"
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">Tossup {tossupVotes}</Typography>
              </Grid>
              <Grid item>
                <Typography style={{ color: red }} variant="h5">
                  Trump {trumpVotes}
                  {trumpVotes >= 270 && (
                    <CheckIcon
                      style={{ marginBottom: -4 }}
                      fontSize="inherit"
                      color="inherit"
                    />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <div className={classes.dividerContainer}>
              <div className={classes.divider}>&nbsp;hello world</div>
            </div>
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
                <br />
                <Typography variant="caption" component="div" align="center">
                  Last Updated {moment(data.lastUpdate).format("llll")}
                </Typography>
                <Typography variant="caption" component="div" align="center">
                  Polling averages are fetched daily from{" "}
                  <Link
                    href="https://www.realclearpolitics.com/epolls/2020/president/2020_elections_electoral_college_map.html"
                    target="rcp"
                  >
                    realclearpolitics.com
                  </Link>
                </Typography>
                <br />
                <br />

                <TossupSlider value={tossup} onChange={(v) => setTossup(v)} />
                <FavorSlider value={favor} onChange={(v) => setFavor(v)} />

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
