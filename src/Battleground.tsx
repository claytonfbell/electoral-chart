import {
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core"
import Button from "material-ui-bootstrap/dist/Button"
import React from "react"
import { blue, displaySpread, red, RowData } from "./App"

interface Props {
  states: RowData[]
}
export default function Battleground(props: Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button
          fullWidth
          color="primary"
          variant={open ? "contained" : "outlined"}
          onClick={() => setOpen(!open)}
        >
          Contested States
        </Button>
      </div>
      <Collapse in={open} style={{ marginTop: 12 }}>
        {open && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {props.states
                  .filter((x) => x.avg >= -6.5 && x.avg <= 6.5)
                  .map((row) => (
                    <TableRow key={row.state}>
                      <TableCell>{row.state}</TableCell>
                      <TableCell align="center">{row.votes} votes</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          color:
                            row.avg === 0
                              ? undefined
                              : row.avg > 0
                              ? blue
                              : red,
                        }}
                      >
                        {displaySpread(row.avg)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <br />
        <br />
        <br />
        <br />
      </Collapse>
    </>
  )
}
