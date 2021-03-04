import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DownloadIcon from "@material-ui/icons/GetApp";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";

import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "../../components/Wrappers/Wrappers";
import config from "../../config";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "& .MuiListItemIcon-root": {
      minWidth: theme.spacing(4),
    },

    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function TranslationInterActions({ pname }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item>
      <IconButton
        variant={"outlined"}
        aria-label="delete"
        style={{ marginTop: 8 }}
        onClick={handleClick}
        color="primary"
      >
        <MenuIcon />
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link
          href={`${config.baseURLApi}/translations/getcsv/${pname}`}
          underline="none"
          color="#fff"
        >
          <StyledMenuItem>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary=".CSV" />
          </StyledMenuItem>
        </Link>

        <Link href="#/app/translation/import-csv" underline="none" color="#fff">
          <StyledMenuItem>
            <ListItemIcon>
              <LabelImportantIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Import CSV" />
          </StyledMenuItem>
        </Link>
      </StyledMenu>
    </Grid>
  );
}
