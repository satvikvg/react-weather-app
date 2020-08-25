import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findPlace, saveConfiguration } from "../../store/app/actions";
import { getTemperature } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    margin: "auto",
  },
  paper: {
    width: "100%",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  popoverTitleBar: {
    margin: "8px auto",
  },
}));

function Welcome(props) {
  const [selectedTempUnit, setSelectedTempUnit] = useState("c");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // Selectors
  const city = useSelector((state) => state.app.city);
  const temperatureUnit = useSelector((state) => state.app.temperatureUnit);
  const longitude = useSelector((state) => state.app.longitude);
  const latitude = useSelector((state) => state.app.latitude);

  const isGeolocationAvailable = useSelector(
    (state) => state.app.isGeolocationAvailable
  );
  const places = useSelector((state) => state.app.places);

  // Dispatcher
  const dispatch = useDispatch();

  // Effect
  useEffect(() => {
    setLocation(city);
    setSelectedTempUnit(temperatureUnit);
    setLat(latitude);
    setLong(longitude);

    return () => {
      // cleanup
    };
  }, [city, temperatureUnit, latitude, longitude]);

  // Change or Click events.
  const handleUnitChange = (event) => {
    setSelectedTempUnit(event.target.value);
  };

  const handleLocationInputChange = (event) => {
    setLocation(event.target.value);

    if (location.length > 2) {
      dispatch(findPlace(location));
      openSuggestionsPopover(event);
    }
  };

  const handleDetectLocationClick = () => {
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);

          dispatch(
            saveConfiguration({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              temperatureUnit: selectedTempUnit,
            })
          );
        },
        (error) => console.error(error)
      );
    }
  };

  const handleSaveClick = () => {
    dispatch(
      saveConfiguration({
        city: location,
        latitude: lat,
        longitude: long,
        temperatureUnit: selectedTempUnit,
      })
    );
  };

  const openSuggestionsPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectPlace = (place) => {
    console.log(place);
    dispatch(
      saveConfiguration({
        city: place.name,
        latitude: place?.coord?.lat,
        longitude: place?.coord?.lon,
        temperatureUnit: selectedTempUnit,
      })
    );
  };

  const open = Boolean(anchorEl) && places.length > 0;
  const id = open ? "simple-popover" : undefined;

  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      <Paper className={classes.paper}>
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h4" align="center">
              Welcome to Hopkins Weather
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" align="center">
              Personalise your weather content
            </Typography>
          </Grid>
          <Divider></Divider>
          <Grid item>
            <Typography variant="h6" align="center">
              Show temperature in
            </Typography>
          </Grid>
          <Grid item>
            <RadioGroup
              aria-label="Temperature Unit"
              name="temperature-unit"
              value={selectedTempUnit}
              onChange={handleUnitChange}
            >
              <Grid container justify="space-evenly">
                <Grid item>
                  <FormControlLabel
                    value="c"
                    control={<Radio />}
                    label="Celsius"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    value="f"
                    control={<Radio />}
                    label="Fahrenheit"
                  />
                </Grid>
              </Grid>
            </RadioGroup>
          </Grid>
          <Divider />
          <Grid item>
            <Button
              variant="outlined"
              onClick={handleDetectLocationClick}
              fullWidth
            >
              Detect my location
            </Button>
          </Grid>
          <Grid item>
            <TextField
              aria-describedby={id}
              variant="outlined"
              type="text"
              placeholder="Search place"
              value={location}
              onChange={handleLocationInputChange}
              fullWidth
            ></TextField>
            {places && places.length ? (
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={1}
                  justify="space-between"
                  className={classes.popoverTitleBar}
                >
                  <Grid item component={Typography} variant="body1" xs={10}>
                    Places found
                  </Grid>
                  <Grid
                    item
                    component={IconButton}
                    onClick={handleClose}
                    xs={2}
                  >
                    <CloseIcon />
                  </Grid>
                </Grid>
                <List>
                  {places.map((place) => (
                    <ListItem
                      key={place.id}
                      component={Button}
                      onClick={(event) => {
                        handleSelectPlace(place);
                      }}
                    >
                      <ListItemText
                        primary={place.name}
                        secondary={`${getTemperature(
                          place?.main?.temp
                        )} °${selectedTempUnit.toUpperCase()} - ${
                          place?.weather[0]?.description
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Popover>
            ) : null}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveClick}
              fullWidth
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default Welcome;
