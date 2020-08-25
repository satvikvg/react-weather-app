import {
  Avatar,
  Card,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOneCallForcastData,
  saveConfiguration,
} from "../../store/app/actions";
import { getTemperature } from "../../utils/helpers";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  card: {
    margin: theme.spacing(2),
    padding: theme.spacing(3),
  },
  divide: {},
  list: {
    display: "flex",
    flexDirection: "row",
    padding: 0,
    overflowX: "auto",
  },
  listItem: {
    margin: theme.spacing(2),
  },
  listItemIcon: {
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
}));

export default function WeatherBoard(props) {
  const city = useSelector((state) => state.app.city);
  const temperatureUnit = useSelector((state) => state.app.temperatureUnit);
  const latitude = useSelector((state) => state.app.latitude);
  const longitude = useSelector((state) => state.app.longitude);
  const weatherData = useSelector((state) => state.app.weatherData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneCallForcastData());
    return () => {
      // Cleanup.
    };
  }, [dispatch]);

  const classes = useStyles();

  let titleText = city
    ? `${city} - ${weatherData.timezone}`
    : weatherData.timezone;
  let date = moment.unix(weatherData?.current?.dt);

  const icon = weatherData?.current?.weather[0].icon;
  const mainIcon = "http://openweathermap.org/img/wn/"
    .concat(icon)
    .concat("@4x.png");

  const handleSettingsClick = () => {
    dispatch(
      saveConfiguration({
        isFTSRequired: true,
        city,
        latitude,
        longitude,
        temperatureUnit,
      })
    );
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        component={Card}
        justify="space-evenly"
        className={classes.card}
        spacing={2}
      >
        <Grid item xs>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h5" noWrap display="initial">
                {titleText}
              </Typography>
              <Typography
                variant="h6"
                color="textSecondary"
                noWrap
                display="initial"
              >
                {`${date.format("dddd, Do")} - ${
                  weatherData?.current?.weather[0]?.description
                }`}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleSettingsClick}>
                <SettingsIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs>
          <Grid container>
            <Grid item xs={12} sm={12} md={6}>
              <Grid item>
                <Typography variant="h2">
                  {getTemperature(weatherData?.current?.temp, temperatureUnit)}{" "}
                  °{temperatureUnit.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid
                    item
                    component={Avatar}
                    variant="square"
                    src="https://img.icons8.com/pastel-glyph/2x/wind--v1.png"
                  ></Grid>
                  <Grid item component={Typography} variant="subtitle1">
                    {weatherData?.current?.wind_speed} mp/h Winds
                  </Grid>

                  <Grid
                    item
                    component={Avatar}
                    src="https://www.seekpng.com/png/small/20-200716_clipart-thermometer-svg-temperature-and-humidity-icon.png"
                  ></Grid>
                  <Grid item component={Typography} variant="subtitle1">
                    {weatherData?.current?.humidity}% Humidity
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <img alt="main_icon" src={mainIcon} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs component={Typography} variant="h5">
          Daily
        </Grid>

        <Grid item xs>
          <Divider className={classes.divide} />
        </Grid>

        <Grid item xs>
          <div className={classes.list}>
            {weatherData?.daily?.map((day) => {
              const date = moment.unix(day?.dt);

              return (
                <Grid key={day?.dt} item className={classes.listItem} xs={3}>
                  <Grid item component={Typography} variant="subtitle1">
                    {date.format("ddd, Do")}
                  </Grid>
                  <Grid
                    item
                    component={Avatar}
                    variant="square"
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="day_cast"
                    className={classes.listItemIcon}
                  ></Grid>
                  <Grid item>
                    <Grid container alignItems="baseline">
                      <Typography variant="subtitle1">
                        {getTemperature(day?.temp?.max)}°
                        {temperatureUnit.toUpperCase()}
                      </Typography>
                      &nbsp;
                      <Typography variant="body2" color="textSecondary">
                        {getTemperature(day?.temp?.min)}°
                        {temperatureUnit.toUpperCase()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item component={Typography} variant="body2">
                    {day.weather[0].description}
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </Grid>

        <Grid item xs component={Typography} variant="h5">
          Hourly
        </Grid>

        <Grid item xs>
          <Divider className={classes.divide} />
        </Grid>

        <Grid item xs>
          <div className={classes.list}>
            {weatherData?.hourly?.map((hour) => {
              const date = moment.unix(hour?.dt);

              return (
                <Grid key={hour?.dt} item className={classes.listItem} xs={3}>
                  <Grid
                    item
                    component={Avatar}
                    variant="square"
                    src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt="day_cast"
                    className={classes.listItemIcon}
                  ></Grid>
                  <Grid item component={Typography} variant="body2">
                    {getTemperature(hour?.temp)}°{temperatureUnit.toUpperCase()}
                  </Grid>
                  <Grid item component={Typography} variant="body2">
                    {hour.weather[0].description}
                  </Grid>
                  <Grid item>
                    <Divider />
                  </Grid>
                  <Grid item component={Typography} variant="subtitle1">
                    {date.format("HH:mm")}
                  </Grid>
                </Grid>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
