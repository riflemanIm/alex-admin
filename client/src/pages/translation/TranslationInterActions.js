import React from "react";
import Box from "@material-ui/core/Box";
import DownloadIcon from "@material-ui/icons/GetApp";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import Grid from "@material-ui/core/Grid";

import { Link, Button } from "../../components/Wrappers/Wrappers";
import config from "../../config";

const TranslationInterActions = ({ pname }) => {
  //  const langs = ["ru", "en", "fr"];
  return (
    <>
      <Grid item>
        <Link
          href={`${config.baseURLApi}/translations/getcsv/${pname}`}
          underline="none"
          color="#fff"
        >
          <Button
            variant={"outlined"}
            color={"secondary"}
            style={{ marginTop: 8 }}
          >
            <Box display={"flex"} mr={1}>
              <DownloadIcon />
            </Box>
            .CVS
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link href="#/app/translation/import-csv" underline="none" color="#fff">
          <Button
            variant={"contained"}
            color={"success"}
            style={{ marginTop: 8 }}
          >
            <Box mr={1} display={"flex"}>
              <LabelImportantIcon />
            </Box>
            Import CSV
          </Button>
        </Link>
      </Grid>
    </>
  );
};
export default TranslationInterActions;