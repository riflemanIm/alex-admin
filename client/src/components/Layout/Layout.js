import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";
// import Icon from "@mdi/react";
// import {
//   //mdiSettings as SettingsIcon,
//   //  mdiFacebookBox as FacebookIcon,
//   //mdiTwitterBox as TwitterIcon,
// //  mdiGithubBox as GithubIcon,
// } from "@mdi/js";
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
// import Dashboard from "../../pages/dashboard";
// import TypographyPage from "../../pages/typography";
import Notifications from "../../pages/notifications";
// import Tables from "../../pages/tables";
// import Icons from "../../pages/icons";
// import Charts from "../../pages/charts";
// import LineCharts from "../../pages/charts/LineCharts";
// import BarCharts from "../../pages/charts/BarCharts";
// import PieCharts from "../../pages/charts/PieCharts";
// import Colors from "../../pages/colors";
// import GridPage from "../../pages/grid";
// import Badge from "../../pages/badge";
// import Carousel from "../../pages/сarousel";
// import Modal from "../../pages/modal";
// import Navbar from "../../pages/nav/Navbar";
// import Tooltips from "../../pages/tooltips";
// import TabsPage from "../../pages/tabs";
// import FormsElements from "../../pages/forms/elements";
// import FormValidation from "../../pages/forms/validation";
// import Cards from "../../pages/cards";
// import DynamicTables from "../../pages/tables/dynamic";
//import WidgetPage from "../../pages/widget";
//import Progress from "../../pages/progress";
//import Ecommerce from "../../pages/ecommerce";
//import Product from "../../pages/ecommerce/Products";
//import ProductsGrid from "../../pages/ecommerce/ProductsGrid";
// import MapsGoogle from '../../pages/maps'
// import VectorMaps from '../../pages/maps/VectorMap'
//import Timeline from "../../pages/timeline";
// import Search from "../../pages/search";
// import Gallery from "../../pages/gallery";
// import Invoice from "../../pages/invoice";
//import CreateProduct from "../../pages/ecommerce/CreateProduct";
// import Calendar from "../../pages/calendar";
import UserList from "../../pages/user/index.js";
import UserAdd from "../../pages/user/AddUser";
import UserEdit from "../../pages/user/EditUser";

import ClinicList from "../../pages/clinic";
import ClinicAdd from "../../pages/clinic/AddClinic";
import ClinicEdit from "../../pages/clinic/EditClinic";

import RegionList from "../../pages/region";
import RegionAdd from "../../pages/region/AddRegion";
import RegionEdit from "../../pages/region/EditRegion";

import PromoList from "../../pages/promo";
import PromoAdd from "../../pages/promo/AddPromo";
import PromoEdit from "../../pages/promo/EditPromo";

import ServiceList from "../../pages/service";
import ServiceAdd from "../../pages/service/AddService";
import ServiceEdit from "../../pages/service/EditService";

import MedicalNetList from "../../pages/medical_net";
import MedicalNetAdd from "../../pages/medical_net/AddMedicalNet";
import MedicalNetEdit from "../../pages/medical_net/EditMedicalNet";

import TranslationList from "../../pages/translation";
import ImportTranslation from "../../pages/translation/ImportTranslation";
import ImportTranslationCSV from "../../pages/translation/ImportTranslationCSV";
import TranslationEdit from "../../pages/translation/EditTranslation";
import BackupTranslation from "../../pages/translation/BackupTranslation";

import AlexList from "../../pages/alex";
import AlexAdd from "../../pages/alex/AddAlex";
import AlexEdit from "../../pages/alex/EditAlex";

import BreadCrumbs from "../../components/BreadCrumbs";

// context
import { useLayoutState } from "../../context/LayoutContext";
//import { ProductsProvider } from "../../context/ProductContext";
import { ManagementProvider } from "../../context/ManagementContext";
import { ClinicProvider } from "../../context/ClinicContext";
import { RegionProvider } from "../../context/RegionContext";
import { PromoProvider } from "../../context/PromoContext";
import { ServiceProvider } from "../../context/ServiceContext";
import { MedicalNetProvider } from "../../context/MedicalNetContext";
import { TranslationProvider } from "../../context/TranslationContext";
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
          {/*<Route path="/app/dashboard" component={Dashboard} />
          <Route path="/app/core/typography" component={TypographyPage} />
          <Route path="/app/core/grid" component={GridPage} />
          
          <Route path="/app/forms/elements" component={FormsElements} />
          <Route path="/app/forms/validation" component={FormValidation} />
          <Route path="/app/ui/badge" component={Badge} />
          <Route path="/app/ui/carousel" component={Carousel} />
          <Route path="/app/ui/modal" component={Modal} />
          <Route path="/app/ui/navbar" component={Navbar} />
          <Route path="/app/ui/tooltips" component={Tooltips} />
          <Route path="/app/ui/tabs" component={TabsPage} />
          <Route path="/app/ui/cards" component={Cards} />
          <Route path="/app/ui/widget" component={WidgetPage} />
          <Route path="/app/ui/progress" component={Progress} />
          <Route path="/app/tables/static" component={Tables} />
          <Route path="/app/tables/dynamic" component={DynamicTables} />
           <Route path="/app/charts/overview" component={Charts} />
          <Route path="/app/charts/line" component={LineCharts} />
          <Route path="/app/charts/bar" component={BarCharts} />
          <Route path="/app/charts/pie" component={PieCharts} /> */}
          {/* <Route path="/app/ecommerce/management" exact>
            <ProductsProvider>
              <Ecommerce />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/management/edit/:id" exact>
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/management/create">
            <ProductsProvider>
              <CreateProduct />
            </ProductsProvider>
          </Route>
          <Route path="/app/ecommerce/product/:id" component={Product} />
          <Route path="/app/ecommerce/product" component={Product} />
          <Route path="/app/ecommerce/gridproducts" component={ProductsGrid} /> 
          <Route
            exact
            path="/app/tables"
            render={() => <Redirect to={"/app/tables/static"} />}
          />
          <Route
            exact
            path="/app/charts"
            render={() => <Redirect to={"/app/charts/overview"} />}
          />
          <Route
            exact
            path="/app/ui"
            render={() => <Redirect to="/app/ui/icons" />}
          />
          <Route
            exact
            path="/app/core"
            render={() => <Redirect to="/app/core/typography" />}
          />
          <Route
            exact
            path="/app/forms"
            render={() => <Redirect to="/app/forms/elements" />}
          />
          <Route
            exact
            path="/app/ecommerce"
            render={() => <Redirect to="/app/ecommerce/management" />}
          />
          {/* <Route
            exact
            path="/app/extra"
            render={() => <Redirect to="/app/extra/timeline" />}
          /> 
          <Route
            exact
            path="/app/maps"
            render={() => <Redirect to="/app/maps/google" />}
          />
          <Route path="/app/ui/icons" component={Icons} />
          <Route path="/app/extra/timeline" component={Timeline} />
          <Route path="/app/extra/search" component={Search} />
          <Route path="/app/extra/gallery" component={Gallery} />
          <Route path="/app/extra/invoice" component={Invoice} />
          <Route path="/app/extra/calendar" component={Calendar} />
          <Route path="/app/core/colors" component={Colors} />
          <Route path="/app/maps/google" component={MapsGoogle} />
          <Route path="/app/maps/vector" component={VectorMaps} /> */}

          {/* ----------------- user ----------------- */}

          <Route
            exact
            path="/app/user"
            render={() => <Redirect to="/app/user/list" />}
          />
          <Route path="/app/user/list">
            <ManagementProvider>
              <UserList />
            </ManagementProvider>
          </Route>
          <Route path="/app/user/add">
            <ManagementProvider>
              <UserAdd />
            </ManagementProvider>
          </Route>
          <Route path="/app/user/:id/edit">
            <ManagementProvider>
              <UserEdit />
            </ManagementProvider>
          </Route>
          <Route path="/app/user/:id">
            <ManagementProvider>
              <UserEdit />
            </ManagementProvider>
          </Route>

          {/* ----------------- clinic ----------------- */}

          <Route
            exact
            path="/app/clinic"
            render={() => <Redirect to="/app/clinic/list" />}
          />
          <Route path="/app/clinic/list">
            <ClinicProvider>
              <ClinicList />
            </ClinicProvider>
          </Route>
          <Route path="/app/clinic/add">
            <ClinicProvider>
              <ClinicAdd />
            </ClinicProvider>
          </Route>
          <Route path="/app/clinic/:id/edit">
            <ClinicProvider>
              <ClinicEdit />
            </ClinicProvider>
          </Route>
          <Route path="/app/clinic/:id">
            <ClinicProvider>
              <ClinicEdit />
            </ClinicProvider>
          </Route>

          {/* ----------------- region ----------------- */}

          <Route
            exact
            path="/app/region"
            render={() => <Redirect to="/app/region/list" />}
          />
          <Route path="/app/region/list">
            <RegionProvider>
              <RegionList />
            </RegionProvider>
          </Route>
          <Route path="/app/region/add">
            <RegionProvider>
              <RegionAdd />
            </RegionProvider>
          </Route>
          <Route path="/app/region/:id/edit">
            <RegionProvider>
              <RegionEdit />
            </RegionProvider>
          </Route>
          <Route path="/app/region/:id">
            <RegionProvider>
              <RegionEdit />
            </RegionProvider>
          </Route>

          {/* ----------------- promo ----------------- */}

          <Route
            exact
            path="/app/promo"
            render={() => <Redirect to="/app/promo/list" />}
          />
          <Route path="/app/promo/list">
            <PromoProvider>
              <PromoList />
            </PromoProvider>
          </Route>
          <Route path="/app/promo/add">
            <PromoProvider>
              <PromoAdd />
            </PromoProvider>
          </Route>
          <Route path="/app/promo/:id/edit">
            <PromoProvider>
              <PromoEdit />
            </PromoProvider>
          </Route>

          {/* ----------------- service ----------------- */}

          <Route
            exact
            path="/app/service"
            render={() => <Redirect to="/app/service/list" />}
          />
          <Route path="/app/service/list">
            <ServiceProvider>
              <ServiceList />
            </ServiceProvider>
          </Route>
          <Route path="/app/service/add/:returnToClinic">
            <ServiceProvider>
              <ServiceAdd />
            </ServiceProvider>
          </Route>
          <Route path="/app/service/add">
            <ServiceProvider>
              <ServiceAdd />
            </ServiceProvider>
          </Route>
          <Route path="/app/service/:id/edit">
            <ServiceProvider>
              <ServiceEdit />
            </ServiceProvider>
          </Route>

          {/* ----------------- medical_net ----------------- */}

          <Route
            exact
            path="/app/medical_net"
            render={() => <Redirect to="/app/medical_net/list" />}
          />
          <Route path="/app/medical_net/list">
            <MedicalNetProvider>
              <MedicalNetList />
            </MedicalNetProvider>
          </Route>
          <Route path="/app/medical_net/add/:returnToClinic">
            <MedicalNetProvider>
              <MedicalNetAdd />
            </MedicalNetProvider>
          </Route>
          <Route path="/app/medical_net/add">
            <MedicalNetProvider>
              <MedicalNetAdd />
            </MedicalNetProvider>
          </Route>
          <Route path="/app/medical_net/:id/edit">
            <MedicalNetProvider>
              <MedicalNetEdit />
            </MedicalNetProvider>
          </Route>

          {/* ----------------- translation ----------------- */}
          <Route
            exact
            path="/app/translation"
            render={() => <Redirect to="/app/translation/list" />}
          />

          <Route exact path="/app/translation/list">
            <TranslationProvider>
              <TranslationList />
            </TranslationProvider>
          </Route>
          <Route exact path="/app/translation/import">
            <TranslationProvider>
              <ImportTranslation />
            </TranslationProvider>
          </Route>
          <Route exact path="/app/translation/import-csv">
            <TranslationProvider>
              <ImportTranslationCSV />
            </TranslationProvider>
          </Route>

          <Route exact path="/app/translation/backups">
            <TranslationProvider>
              <BackupTranslation />
            </TranslationProvider>
          </Route>
          <Route exact path="/app/translation/:id/edit">
            <TranslationProvider>
              <TranslationEdit />
            </TranslationProvider>
          </Route>

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
              Mobimed
            </Link>
            <Link
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
            </Link>
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
