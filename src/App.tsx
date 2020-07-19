import {
  createMuiTheme,
  CssBaseline,
  fade,
  Grid,
  makeStyles,
  Paper,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@material-ui/core"
import Container from "@material-ui/core/Container"
import axios from "axios"
import { Button } from "material-ui-bootstrap"
import moment from "moment"
import React from "react"
import data from "./data/data.json"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: `#0077cf`,
    },
  },
})

const useStyles = makeStyles({
  paper: {
    padding: theme.spacing(4),
  },
  state: {
    borderRight: `1px solid #ccc`,
    borderTop: `1px solid #aaa`,
    borderBottom: `1px solid #aaa`,
    display: "inline-block",
    minHeight: 128,
  },
  divided: { width: "50%", borderRight: `2px dashed #333` },
})

type State = {
  state: string
  avg: number
  votes: number
}

function App() {
  const classes = useStyles()
  const votePct = (votes: number) => 100 * ((votes || 0) / 538)

  function calculateColor(row: State) {
    const blue = `#0077cf`
    const red = `#c82333`
    let color = row.avg === 0 ? "#ccc" : row.avg > 0 ? blue : red

    const spread = Math.min(33, row.avg > 0 ? row.avg : row.avg * -1)
    color = fade(color, spread / 33)
    return color
  }

  function handleUpdate() {
    setDisabled(true)
    axios
      .post("https://api.netlify.com/build_hooks/5f14d84d09fd44852be21758")
      .then((resp) => {
        console.log(resp)
      })
  }

  const [disabled, setDisabled] = React.useState(false)

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <CssBaseline />
        <Grid
          container
          style={{ height: "100vh", width: "100%" }}
          alignItems="center"
        >
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container justify="space-between">
                <Grid item className={classes.divided}>
                  <Typography variant="h4">
                    Biden{" "}
                    {data.states.reduce(
                      (a, b) => a + (b.avg > 0 ? b.votes : 0),
                      0
                    )}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h4">
                    Trump{" "}
                    {data.states.reduce(
                      (a, b) => a + (b.avg < 0 ? b.votes : 0),
                      0
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {data.states
                .sort((a, b) => b.avg - a.avg)
                .map((row) => (
                  <Tooltip
                    key={row.state}
                    title={`${row.state} ${
                      row.avg === 100 || row.avg === -100
                        ? ""
                        : row.avg === 0
                        ? `Tie`
                        : row.avg > 0
                        ? `Biden ${row.avg}%`
                        : `Trump ${row.avg * -1}%`
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
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="caption">
                    Last Updated {moment(data.lastUpdate).format("llll")}
                  </Typography>
                </Grid>
                <Grid item>
                  {false && (
                    <Button
                      disabled={disabled}
                      color="primary"
                      variant="outlined"
                      onClick={handleUpdate}
                    >
                      Update Now
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
