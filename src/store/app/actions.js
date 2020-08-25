import * as ls from "local-storage";
import {
  INITIALIZE_APP,
  INITIALIZE_APP_SUCCESS,
  ONE_CALL_WEATHER_DATA_FAILURE,
  ONE_CALL_WEATHER_DATA_REQUEST,
  ONE_CALL_WEATHER_DATA_SUCCESS,
  FIND_PLACE_REQUEST,
  FIND_PLACE_SUCCESS,
  FIND_PLACE_FAILURE,
} from "./types";
import { config } from "../../configuration/config";

export const initializeApp = () => (dispatch, getState) => {
  dispatch({ type: INITIALIZE_APP });

  const initialData = {
    isLoading: false,
    isFTSRequired: ls.get("isFTSRequired"),
    isGeolocationAvailable: "geolocation" in navigator,
    city: ls.get("city"),
    temperatureUnit: ls.get("temperatureUnit"),
    longitude: ls.get("longitude"),
    latitude: ls.get("latitude"),
  };

  dispatch({ type: INITIALIZE_APP_SUCCESS, payload: initialData });
};

export const saveConfiguration = (config) => (dispatch, getState) => {
  // Save configuraton to local storage and update redux store.
  ls.set("isFTSRequired", config.isFTSRequired ? config.isFTSRequired : false);
  ls.set("isGeolocationAvailable", getState().app.isGeolocationAvailable);
  ls.set("city", config.city);
  ls.set("temperatureUnit", config.temperatureUnit);
  ls.set("longitude", config.longitude);
  ls.set("latitude", config.latitude);

  // Update configuration into redux store.
  const initialData = {
    isLoading: false,
    isFTSRequired: ls.get("isFTSRequired"),
    isGeolocationAvailable: "geolocation" in navigator,
    city: config.city,
    temperatureUnit: config.temperatureUnit,
    longitude: config.longitude,
    latitude: config.latitude,
  };

  dispatch({ type: INITIALIZE_APP_SUCCESS, payload: initialData });
};

export const getOneCallForcastData = () => async (dispatch, getState) => {
  dispatch({ type: ONE_CALL_WEATHER_DATA_REQUEST });

  const lat = ls.get("latitude");
  const lon = ls.get("longitude");

  try {
    const response = await fetch(
      `${config.URL}${config.CONTEXT}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${config.APP_ID}`
    );

    const data = response ? await response.json() : null;

    if (data) {
      dispatch({ type: ONE_CALL_WEATHER_DATA_SUCCESS, payload: data });
    }
  } catch (error) {
    console.error(error);
    dispatch({ type: ONE_CALL_WEATHER_DATA_FAILURE, payload: error });
  }
};

export const findPlace = (query) => async (dispatch, getState) => {
  dispatch({ type: FIND_PLACE_REQUEST });

  try {
    const response = await fetch(
      `${config.URL}${config.CONTEXT}/find?q=${query}&type=like&sort=population&cnt=30&appid=${config.APP_ID}`
    );

    const data = response ? await response.json() : null;

    if (data) {
      dispatch({ type: FIND_PLACE_SUCCESS, payload: data.list });
    }
  } catch (error) {
    console.error(error);
    dispatch({ type: FIND_PLACE_FAILURE, payload: error });
  }
};
