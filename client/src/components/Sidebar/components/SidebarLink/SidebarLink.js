import React, { useState } from "react";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField as Input,
  Typography,
} from "@material-ui/core";
import {
  Inbox as InboxIcon,
  ExpandMore as ExpandIcon,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";
import useStyles2 from "../../styles";

// components
import Dot from "../Dot";
import { Button, Badge } from "../../../Wrappers";
import Chat from "../../../Chat";

export default function SidebarLink({
  link,
  icon,
  label,
  children,
  location,
  isSidebarOpened,
  nested,
  type,
  toggleDrawer,
  click,
  ...props
}) {
  // local
  const [isOpen, setIsOpen] = useState(false);
  // Add Section Popover state
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Chat Modal state
  const [isChat, setChat] = useState(false);

  // Login page onClick
  function onLogin() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  onLogin.clickName = "onLogin";

  const classes = useStyles(isOpen);
  const classes2 = useStyles2();
  const isLinkActive =
    link && (location.pathname === link || location.pathname.includes(link));

  if (type === "title")
    return (
      <Typography
        className={classnames(classes.linkText, classes.sectionTitle, {
          [classes.linkTextHidden]: !isSidebarOpened,
        })}
      >
        {label}
      </Typography>
    );

  if (type === "divider") return <Divider className={classes.divider} />;

  if (type === "margin") return <section style={{ marginTop: 240 }} />;

  // Add Section Popover

  const open = Boolean(anchorEl);
  const id = open ? "add-section-popover" : undefined;

  function addSectionClick(event) {
    setAnchorEl(event.currentTarget);
  }

  addSectionClick.clickName = "addSectionClick";

  const addSectionClose = () => {
    setAnchorEl(null);
  };

  // Chat Popper

  function chatSetOpen() {
    setChat(true);
  }

  chatSetOpen.clickName = "chatSetOpen";

  const chatSetClose = () => {
    setChat(false);
  };

  if (!children)
    return (
      <>
        <ListItem
          onClick={(e) => {
            if (click) {
              return click(e, addSectionClick, chatSetOpen, onLogin);
            }
            return toggleDrawer(e);
          }}
          onKeyPress={toggleDrawer}
          button
          component={link && Link}
          to={link}
          className={classes.link}
          classes={{
            root: classnames(classes.link, {
              [classes.linkActive]: isLinkActive && !nested,
              [classes.linkNested]: nested,
            }),
          }}
          disableRipple
        >
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
            style={{ margin: nested && -11 }}
          >
            {nested ? <Dot color={isLinkActive && "primary"} /> : icon}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
        </ListItem>
        <Chat open={isChat} onClose={chatSetClose} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={addSectionClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          classes={{ paper: classes2.popover }}
        >
          <Box m={3} display="flex" flexDirection="column">
            <Typography>Add section</Typography>
            <Input
              placeholder="Section Name"
              classes={{ root: classes2.input }}
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                color="secondary"
                variant="contained"
                className={classes2.noBoxShadow}
              >
                Add
              </Button>
              <Button
                classes={{ label: classes2.buttonLabel }}
                onClick={addSectionClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Popover>
      </>
    );

  return (
    <>
      {props.badge ? (
        <ListItem
          button
          component={link && Link}
          onClick={toggleCollapse}
          className={classnames(classes.link, {
            [classes.linkActive]: isLinkActive,
            [classes.nestedMenu]: type === "nested",
          })}
          to={link}
          disableRipple
        >
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {icon ? icon : <InboxIcon />}
          </ListItemIcon>
          <Badge badgeContent={props.badge} color={props.badgeColor}>
            <ListItemText
              classes={{
                primary: classnames(classes.linkText, {
                  [classes.linkTextActive]: isLinkActive,
                  [classes.linkTextHidden]: !isSidebarOpened,
                }),
              }}
              primary={label}
            />
          </Badge>
          <ExpandIcon
            className={classnames(
              {
                [classes.expand]: isOpen,
                [classes.linkTextHidden]: !isSidebarOpened,
              },
              classes.expandWrapper
            )}
          />
        </ListItem>
      ) : (
        <ListItem
          button
          component={link && Link}
          onClick={toggleCollapse}
          className={classnames(classes.link, {
            [classes.linkActive]: isLinkActive,
            [classes.nestedMenu]: type === "nested",
          })}
          to={link}
          disableRipple
        >
          <ListItemIcon
            className={classnames(classes.linkIcon, {
              [classes.linkIconActive]: isLinkActive,
            })}
          >
            {icon ? icon : <InboxIcon />}
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classnames(classes.linkText, {
                [classes.linkTextActive]: isLinkActive,
                [classes.linkTextHidden]: !isSidebarOpened,
              }),
            }}
            primary={label}
          />
          <ExpandIcon
            className={classnames(
              {
                [classes.expand]: isOpen,
                [classes.linkTextHidden]: !isSidebarOpened,
              },
              classes.expandWrapper
            )}
          />
        </ListItem>
      )}
      {children && (
        <Collapse
          in={isOpen && isSidebarOpened}
          timeout="auto"
          unmountOnExit
          className={classnames(classes.nestedList, {
            [classes.nestedMenuItem]: type === "nested",
          })}
        >
          <List component="div" disablePadding>
            {children.map((childrenLink) => (
              <SidebarLink
                key={(childrenLink && childrenLink.link) || childrenLink.label}
                location={location}
                isSidebarOpened={isSidebarOpened}
                classes={classes}
                toggleDrawer={toggleDrawer}
                nested
                {...childrenLink}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );

  // ###########################################################

  function toggleCollapse(e) {
    if (isSidebarOpened) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  }
}
