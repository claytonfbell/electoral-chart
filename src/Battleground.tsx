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
import { blue, displaySpread, red, State } from "./App"

interface Props {
  states: State[]
}
export default function Battleground(props: Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button
          color="primary"
          variant={open ? "contained" : "outlined"}
          onClick={() => setOpen(!open)}
        >
          States Less then 5% Spread
        </Button>
      </div>
      <Collapse in={open} style={{ marginTop: 12 }}>
        {open && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {props.states
                  .filter((x) => x.avg >= -5 && x.avg <= 5)
                  .map((row) => (
                    <TableRow key={row.state}>
                      <TableCell>{row.state}</TableCell>
                      <TableCell
                        style={{
                          color:
                            row.avg === 0
                              ? undefined
                              : row.avg > 0
                              ? blue
                              : red,
                        }}
                      >
                        {displaySpread(row)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Collapse>
    </>
  )
}
