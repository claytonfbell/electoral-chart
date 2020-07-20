import Slider from "@material-ui/core/Slider"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Typography from "@material-ui/core/Typography"
import React from "react"

const useStyles = makeStyles({
  root: {
    textAlign: "center",
  },
})

function valuetext(value: number) {
  return `${value}`
}

interface Props {
  value: number
  onChange: (value: number) => void
}
export default function FavorSlider(props: Props) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        {props.value === 0
          ? "Margin for Error Slider"
          : props.value < 0
          ? `+${(props.value * -1).toFixed(1)}% for Biden`
          : `+${props.value.toFixed(1)}% for Trump`}
      </Typography>
      <Slider
        getAriaValueText={valuetext}
        valueLabelDisplay="off"
        step={0.5}
        marks
        min={-10}
        max={10}
        value={props.value}
        onChange={(x, v) => props.onChange(v as number)}
      />
    </div>
  )
}
