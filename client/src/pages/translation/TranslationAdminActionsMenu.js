import React from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DownloadIcon from "@material-ui/icons/GetApp";
import MenuIcon from "@material-ui/icons/Menu";
import RestoreIcon from "@material-ui/icons/Restore";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
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

export default function TranslationAdminActions({ pname }) {
  const langs = ["ru", "en", "fr"];

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
        <Link href="#/app/translation/import" underline="none" color="#fff">
          <StyledMenuItem>
            <ListItemIcon>
              <LabelImportantIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Import" />
          </StyledMenuItem>
        </Link>
        <Link href="#/app/translation/backups" underline="none" color="#fff">
          <StyledMenuItem>
            <ListItemIcon>
              <RestoreIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Restore" />
          </StyledMenuItem>
        </Link>

        {langs.map((lang) => (
          <Link
            href={`${config.baseURLApi}/translations/download/${lang}/${pname}`}
            underline="none"
            color="#fff"
            key={lang}
          >
            <StyledMenuItem>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={lang} />
            </StyledMenuItem>
          </Link>
        ))}
      </StyledMenu>
    </Grid>
  );
}
