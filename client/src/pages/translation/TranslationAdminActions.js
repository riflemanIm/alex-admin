import React from "react";
import Box from "@material-ui/core/Box";
import DownloadIcon from "@material-ui/icons/GetApp";
import RestoreIcon from "@material-ui/icons/Restore";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import Grid from "@material-ui/core/Grid";

import { Link, Button } from "../../components/Wrappers/Wrappers";
import config from "../../config";

const TranslationAdminActions = ({ pname }) => {
  const langs = ["ru", "en", "fr"];
  return (
    <>
      <Grid item>
        <Link href="#/app/translation/import" underline="none" color="#fff">
          <Button
            variant={"contained"}
            color={"success"}
            style={{ marginTop: 8 }}
          >
            <Box mr={1} display={"flex"}>
              <LabelImportantIcon />
            </Box>
            Import
          </Button>
        </Link>
      </Grid>
      <Grid item>
        <Link href="#/app/translation/backups" underline="none" color="#fff">
          <Button
            variant={"contained"}
            color={"success"}
            style={{ marginTop: 8 }}
          >
            <Box mr={1} display={"flex"}>
              <RestoreIcon />
            </Box>
            Restore
          </Button>
        </Link>
      </Grid>
      {langs.map((lang) => (
        <Grid item key={lang}>
          <Link
            href={`${config.baseURLApi}/translations/download/${lang}/${pname}`}
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
              {lang}
            </Button>
          </Link>
        </Grid>
      ))}
      <Grid item></Grid>
    </>
  );
};
export default TranslationAdminActions;
