import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline"
import Grid from "@material-ui/core/Grid/Grid"
import Hidden from "@material-ui/core/Hidden/Hidden"
import { ThemeProvider } from "@material-ui/core/styles"
import { fade } from "@material-ui/core/styles/colorManipulator"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"
import Typography from "@material-ui/core/Typography/Typography"
import CheckIcon from "@material-ui/icons/Check"
import moment from "moment"
import React from "react"
import AnimatedCounter from "./AnimatedCounter"
import Battleground from "./Battleground"
import data from "./data/data.json"
import FavorSlider from "./FavorSlider"
import SelectAvgType from "./SelectAvgType"
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
    pointerEvents: "none",
  },
  divider: {
    position: "absolute",
    borderRight: `2px dashed #999`,
    minHeight: 96,
    width: `50%`,
    pointerEvents: "none",
  },
}))

export const blue = `#0077cf`
export const red = `#c82333`
const capUnknown = 29

export function displaySpread(avg: number) {
  return avg === 0
    ? `Tie`
    : avg > 0
    ? `Biden +${avg.toFixed(1)}%`
    : `Trump +${(avg * -1).toFixed(1)}%`
}

export type State = {
  state: string
  stateName: string
  votes: number
  rcpAvg?: number
  fteAvg?: number
  isBlue?: boolean
  fteUpdatedAt?: string
  rcpUpdatedAt?: string
}

export type RowData = {
  state: string
  stateName: string
  votes: number
  avg: number
}

export type AvgType = "rcpAvg" | "fteAvg"

function App() {
  const classes = useStyles()

  const [avgType, setAvgType] = React.useState<AvgType>("fteAvg")
  const [tossup, setTossup] = React.useState(0)

  const votePct = React.useCallback(
    (votes: number) => 100 * ((votes || 0) / 538),
    []
  )

  const calculateFade = React.useCallback(
    (avg: number) => {
      const spread = Math.min(capUnknown, (avg > 0 ? avg : avg * -1) - tossup)
      return spread / capUnknown
    },
    [tossup]
  )

  const calculateColor = React.useCallback(
    (avg: number) => {
      let color =
        avg >= -tossup && avg <= tossup ? "#ccc" : avg > 0 ? blue : red
      color = fade(color, calculateFade(avg))
      return color
    },
    [calculateFade, tossup]
  )

  // adjust number per favor slider
  const [favor, setFavor] = React.useState(0)
  const states: RowData[] = React.useMemo(
    () =>
      data.states.map((x) => ({
        state: x.state,
        stateName: x.stateName,
        votes: x.votes,
        avg:
          favor * -1 +
          Math.max(
            -capUnknown,
            Math.min(
              capUnknown,
              x[avgType] === undefined
                ? !x.isBlue
                  ? -100
                  : 100
                : (x[avgType] as number)
            )
          ),
      })),
    [avgType, favor]
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

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: blue,
          },
          secondary: {
            main: red,
          },
        },
      }),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Grid
          container
          style={{ marginTop: 24, width: "100%" }}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Grid container justify="space-between">
              <Grid item>
                <Typography style={{ color: blue }} variant="h5">
                  Biden <AnimatedCounter value={bidenVotes} />
                  {bidenVotes >= 270 && (
                    <CheckIcon
                      style={{ marginBottom: -4 }}
                      fontSize="inherit"
                      color="inherit"
                    />
                  )}
                </Typography>
              </Grid>
              <Hidden xsDown>
                <Grid item>
                  <Typography style={{ color: "#666" }} variant="h5">
                    Tossup <AnimatedCounter value={tossupVotes} />
                  </Typography>
                </Grid>
              </Hidden>
              <Grid item>
                <Typography style={{ color: red }} variant="h5">
                  Trump <AnimatedCounter value={trumpVotes} />
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
              <div className={classes.divider}></div>
            </div>

            {states
              .sort((a, b) => b.avg - a.avg)
              .map((row) => (
                <Tooltip
                  key={row.state}
                  title={`${row.stateName} - ${
                    row.avg >= capUnknown || row.avg <= -capUnknown
                      ? ""
                      : displaySpread(row.avg)
                  }`}
                >
                  <div
                    className={classes.state}
                    style={{
                      backgroundColor: calculateColor(row.avg),
                      width: `${votePct(row.votes)}%`,
                    }}
                  ></div>
                </Tooltip>
              ))}

            <Grid container justify="center">
              <Grid item>
                <div style={{ textAlign: "center" }}>
                  <SelectAvgType
                    value={avgType}
                    onChange={(v) => setAvgType(v)}
                  />

                  <TossupSlider value={tossup} onChange={(v) => setTossup(v)} />
                  <FavorSlider value={favor} onChange={(v) => setFavor(v)} />
                </div>

                <Battleground states={states} />
                <br />

                <Typography variant="caption" component="div" align="center">
                  Last Updated {moment(data.lastUpdate).format("llll")}
                </Typography>
                <Typography variant="caption" component="div" align="center">
                  Polling averages are fetched daily
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
