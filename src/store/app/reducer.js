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

const INITIAL_STATE = {
  isLoading: false,
  isFTSRequired: true,
  isGeolocationAvailable: true,
  city: "",
  temperatureUnit: "c",
  longitude: 0,
  latitude: 0,
  weatherData: {},
  error: null,
  places: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIALIZE_APP:
      return { ...state, isLoading: true, error: null };

    case INITIALIZE_APP_SUCCESS:
      return { ...state, ...action.payload, isLoading: false, error: null };

    case ONE_CALL_WEATHER_DATA_REQUEST:
      return { ...state, isLoading: true, error: null };

    case ONE_CALL_WEATHER_DATA_SUCCESS:
      return {
        ...state,
        weatherData: action.payload,
        isLoading: false,
        error: null,
      };

    case FIND_PLACE_REQUEST:
      return { ...state, isLoading: true, error: null };
    case FIND_PLACE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        places: action.payload,
      };

    case ONE_CALL_WEATHER_DATA_FAILURE:
    case FIND_PLACE_FAILURE:
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
};

export default reducer;
