import React from "react";
import { Grid, TextField as Input, InputAdornment } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import {
  useTranslationDispatch,
  useTranslationState,
  actions,
} from "../../context/TranslationContext";
import isEmpty from "../../helpers/isEmpty";
import config from "../../config";

export default function TranslationFilters({ setPage, setTranslationsRows }) {
  const { rows, filterVals } = useTranslationState();
  React.useEffect(() => {
    setTimeout(() => {
      if (!isEmpty(rows)) {
        doFilter();
        setPage(0);
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVals, rows]);

  //const pNames = [...new Set(rows.map((item) => item.pname))];
  const pNames = config.pNames;
  const gKeys = [
    ...new Set(
      rows
        .filter(
          (item) => item.pname === filterVals.pname || filterVals.pname === ""
        )
        .map((item) => item.gkey)
    ),
  ].sort();

  const translationDispatch = useTranslationDispatch();

  const handleChangeFilter = (e, curKey = null) => {
    const newFilterVals = { ...filterVals };

    if (curKey != null) {
      newFilterVals[curKey] = e.target.value;
    } else {
      newFilterVals.lang_value = e.target.value;
    }
    actions.setFilter(newFilterVals)(translationDispatch);
  };

  const doFilter = () => {
    let newArr = [...rows];
    Object.keys(filterVals)
      .filter((item) => item === "pname" || item === "gkey")
      .forEach((fkey) => {
        if (filterVals[fkey] !== "") {
          newArr = newArr.filter((c) => c[fkey] === filterVals[fkey]);
        }
      });

    if (filterVals.checked === "checked_all") {
      newArr = newArr.filter(
        (row) => row.checked_en && row.checked_ru && row.checked_fr
      );
    }
    if (filterVals.checked === "not_checked_all") {
      newArr = newArr.filter(
        (row) => !row.checked_en || !row.checked_ru || !row.checked_fr
      );
    }
    if (["ru", "en", "fr"].includes(filterVals.checked)) {
      const lang = filterVals.checked;
      newArr = newArr.filter((row) => !row[`checked_${lang}`]);
    }

    if (filterVals.lang_value !== "")
      newArr = newArr.filter((c) => {
        return `${c.tkey}${c.lang_ru}${c.lang_en}${c.lang_fr}`
          .toLowerCase()
          .includes(filterVals.lang_value.toLowerCase());
      });

    setTranslationsRows(newArr);
  };
  return (
    <>
      <Grid item>
        <FormControl
          variant="outlined"
          margin="dense"
          fullWidth
          style={{ minWidth: 150 }}
        >
          <InputLabel id="id-pname-label">Name of project</InputLabel>
          <Select
            labelId="id-pname-label"
            id="id-pname-select"
            label="Name of project"
            onChange={(e) => handleChangeFilter(e, "pname")}
            value={filterVals.pname}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {pNames.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl
          variant="outlined"
          margin="dense"
          fullWidth
          style={{ minWidth: 150 }}
        >
          <InputLabel id="id-gkey-select-label">Status</InputLabel>
          <Select
            labelId="id-gkey-select-label"
            id="id-gkey-select"
            label="Status"
            onChange={(e) => handleChangeFilter(e, "checked")}
            value={filterVals.checked}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="checked_all">Verified</MenuItem>
            <MenuItem value="not_checked_all">Not verified</MenuItem>
            <MenuItem value="ru">Not Verified RU</MenuItem>
            <MenuItem value="en">Not Verified EN</MenuItem>
            <MenuItem value="fr">Not Verified FR</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl
          variant="outlined"
          margin="dense"
          fullWidth
          style={{ minWidth: 150 }}
        >
          <InputLabel id="id-gkey-select-label">Group</InputLabel>
          <Select
            labelId="id-gkey-select-label"
            id="id-gkey-select"
            label="Group"
            onChange={(e) => handleChangeFilter(e, "gkey")}
            value={filterVals.gkey}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {gKeys.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Input
          id="search-field"
          label="Search by Key and/or Value"
          margin="dense"
          variant="outlined"
          value={filterVals.lang_value}
          onChange={(e) => handleChangeFilter(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </>
  );
}
