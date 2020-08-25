import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveConfiguration } from "../../store/app/actions";

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
}));

function Welcome(props) {
  const [selectedTempUnit, setSelectedTempUnit] = useState("c");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  const dispatch = useDispatch();

  const isGeolocationAvailable = useSelector(
    (state) => state.app.isGeolocationAvailable
  );

  const handleUnitChange = (event) => {
    setSelectedTempUnit(event.target.value);
  };

  const handleLocationInputChange = (event) => {
    setLocation(event.target.value);
  };

  const handleDetectLocationClick = () => {
    if (isGeolocationAvailable) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
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
            <Button variant="outlined" onClick={handleDetectLocationClick}>
              Detect my location
            </Button>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              type="text"
              placeholder="Location"
              value={location}
              onChange={handleLocationInputChange}
              fullWidth
            ></TextField>
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
