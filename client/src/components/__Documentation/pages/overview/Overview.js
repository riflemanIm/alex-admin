import React from "react";
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import {
  Done as DoneIcon,
  ArrowRightAlt as ArrowRight,
} from "@material-ui/icons";

import useStyles from "./styles";

//components
import Widget from "../../../Widget/Widget";
import { Typography, Link } from "../../../Wrappers/Wrappers";

const Overview = () => {
  const styles = useStyles();
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Widget disableWidgetMenu>
            <Typography variant={"h6"}>
              Mobimed Admin Full is an admin dashboard template built with React
              16.8.6. Sing App goes beyond usual admin templates and provides
              you entire intuitive programming framework. You can use Mobimed
              Admin Full to build any type of web applications like SAAS, CMS,
              financial dashboards, project management tools, etc.
            </Typography>
            <Box pt={6}>
              <Typography variant={"h3"}>Features</Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Hundreds of Pages" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Fully Responsive" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="React 16 new" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Material-UI v4.6" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="2 Charts Library" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Theme Change Support" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="E-Commerce Section" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="2 State Sidebar" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="Fully Documented Codebase" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText primary="And even more coming soon!" />
              </ListItem>
            </List>
            <Box display={"flex"} justifyContent={"space-around"} my={3}>
              <Box>
                <Typography variant={"h3"} style={{ marginBottom: 16 }}>
                  Continue with
                </Typography>
                <Link
                  href={"#/documentation/getting-started/licences"}
                  variant={"h6"}
                  color={"primary"}
                  className={styles.link}
                >
                  Licences <ArrowRight />
                </Link>
              </Box>
              <Box>
                <Typography variant={"h3"} style={{ marginBottom: 16 }}>
                  Or learn about
                </Typography>
                <Link
                  href={"#/documentation/getting-started/quick-start"}
                  variant={"h6"}
                  color={"primary"}
                  className={styles.link}
                >
                  How to start project <ArrowRight />
                </Link>
              </Box>
            </Box>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
