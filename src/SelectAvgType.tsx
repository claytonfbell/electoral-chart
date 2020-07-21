import { Grid } from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import React from "react"
import { AvgType } from "./App"

interface Props {
  value: AvgType
  onChange: (value: AvgType) => void
}

export default function SelectAvgType(props: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange((event.target as HTMLInputElement).value as AvgType)
  }

  return (
    <>
      <RadioGroup
        aria-label="poll"
        name="avgType"
        value={props.value}
        onChange={handleChange}
      >
        <Grid container spacing={0} justify="space-between">
          <Grid item>
            <FormControlLabel
              value="fteAvg"
              control={<Radio />}
              label="Five Thirty Eight"
              labelPlacement="top"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              value="rcpAvg"
              control={<Radio />}
              label="Real Clear Politics"
              labelPlacement="top"
            />
          </Grid>
        </Grid>
      </RadioGroup>
    </>
  )
}
