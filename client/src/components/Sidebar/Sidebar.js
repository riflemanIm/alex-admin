import React, { useState, useEffect } from "react";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";
import { Drawer, IconButton, List } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";

function Sidebar({ location, structure }) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    currentUser: { status },
  } = useUserState();
  // console.log("status", status);
  const toggleDrawer = (value) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (value && !isPermanent) toggleSidebar(layoutDispatch);
  };

  // global
  const { isSidebarOpened } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  // local
  const [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: !isPermanent ? !isSidebarOpened : isSidebarOpened,
        [classes.drawerClose]: !isPermanent
          ? isSidebarOpened
          : !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: !isPermanent
            ? !isSidebarOpened
            : isSidebarOpened,
          [classes.drawerClose]: !isPermanent
            ? isSidebarOpened
            : !isSidebarOpened,
        }),
      }}
      open={!isPermanent ? !isSidebarOpened : isSidebarOpened}
      onClose={toggleDrawer(true)}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List
        className={classes.sidebarList}
        classes={{ padding: classes.padding }}
      >
        {structure
          .filter((item) => item?.role != null && item.role.includes(status))
          .map((link) => (
            <SidebarLink
              key={link.id}
              location={location}
              isSidebarOpened={
                !isPermanent ? !isSidebarOpened : isSidebarOpened
              }
              {...link}
              toggleDrawer={toggleDrawer(true)}
            />
          ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    const windowWidth = window.innerWidth;
    const breakpointWidth = theme.breakpoints.values.md;
    const isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
