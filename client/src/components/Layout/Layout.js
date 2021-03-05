import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { Fab } from "@material-ui/core";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import { Link } from "../../components/Wrappers";
import ColorChangeThemePopper from "./components/ColorChangeThemePopper";

// pages
import Notifications from "../../pages/notifications";

import AlexList from "../../pages/alex";
import AlexAdd from "../../pages/alex/AddAlex";
import AlexEdit from "../../pages/alex/EditAlex";

import BreadCrumbs from "../../components/BreadCrumbs";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { AlexProvider } from "../../context/AlexContext";
//Sidebar structure
import structure from "../Sidebar/SidebarStructure";

function Layout(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "add-section-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  // global
  const layoutState = useLayoutState();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar structure={structure} />
      <div
        className={classnames(classes.content, {
          [classes.contentShift]: layoutState.isSidebarOpened,
        })}
      >
        <div className={classes.fakeToolbar} />
        <BreadCrumbs />
        <Switch>
          <Route path="/app/ui/notifications" component={Notifications} />

          {/* ----------------- alex ----------------- */}

          <Route
            exact
            path="/app/alex"
            render={() => <Redirect to="/app/alex/list" />}
          />
          <Route path="/app/alex/list">
            <AlexProvider>
              <AlexList />
            </AlexProvider>
          </Route>
          <Route path="/app/alex/add/:returnToClinic">
            <AlexProvider>
              <AlexAdd />
            </AlexProvider>
          </Route>
          <Route path="/app/alex/add">
            <AlexProvider>
              <AlexAdd />
            </AlexProvider>
          </Route>
          <Route path="/app/alex/:id/edit">
            <AlexProvider>
              <AlexEdit />
            </AlexProvider>
          </Route>
        </Switch>
        <Fab
          color="primary"
          aria-label="settings"
          onClick={(e) => handleClick(e)}
          className={classes.changeThemeFab}
          style={{ zIndex: 100 }}
        >
          <SettingsIcon />
        </Fab>
        <ColorChangeThemePopper id={id} open={open} anchorEl={anchorEl} />
        <Footer>
          <div>
            <Link
              color={"primary"}
              href={"https://mobimed.ru/"}
              target={"_blank"}
              className={classes.link}
            >
              Alex Admin
            </Link>
            {/* <Link
              color={"primary"}
              href={"https://mobimed.ru/about"}
              target={"_blank"}
              className={classes.link}
            >
              About Us
            </Link>
            <Link
              color={"primary"}
              href={"https://mobimed.ru/blog"}
              target={"_blank"}
              className={classes.link}
            >
              Blog
            </Link> */}
          </div>
          {/* <div>
            <Link href={"https://www.facebook.com/mobimed"} target={"_blank"}>
              <IconButton aria-label="facebook">
                <Icon path={FacebookIcon} size={1} color="#6E6E6E99" />
              </IconButton>
            </Link>
            <Link href={"https://twitter.com/mobimed"} target={"_blank"}>
              <IconButton aria-label="twitter">
                <Icon path={TwitterIcon} size={1} color="#6E6E6E99" />
              </IconButton>
            </Link>
            <Link href={"https://github.com/mobimed"} target={"_blank"}>
              <IconButton
                aria-label="github"
                style={{ padding: "12px 0 12px 12px" }}
              >
                <Icon path={GithubIcon} size={1} color="#6E6E6E99" />
              </IconButton>
            </Link>
          </div> */}
        </Footer>
      </div>
    </div>
  );
}

export default withRouter(Layout);
