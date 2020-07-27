import { lighten } from "@material-ui/core/styles/colorManipulator"
import { Theme } from "@material-ui/core/styles/createMuiTheme"
import withStyles from "@material-ui/core/styles/withStyles"
import Tooltip from "@material-ui/core/Tooltip/Tooltip"

const CustomToolTip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: lighten(theme.palette.common.black, 0.2),
    color: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    fontSize: 18,
  },
}))(Tooltip)

export default CustomToolTip
