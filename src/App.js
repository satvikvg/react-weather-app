import { LinearProgress, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import WeatherBoard from "./containers/pages/WeatherBoard";
import Welcome from "./containers/pages/Welcome";
import { initializeApp } from "./store/app/actions";

const useStyles = makeStyles((theme) => ({
  app: {
    width: "auto",
    backgroundColor: "#f5f5f5",
  },
}));

function App() {
  const isLoading = useSelector((state) => state.app.isLoading);
  const isFTSRequired = useSelector((state) => state.app.isFTSRequired);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  const classes = useStyles();
  return (
    <div className={classes.app}>
      {isLoading && <LinearProgress variant="indeterminate" />}
      {isFTSRequired && <Welcome />}
      {!isFTSRequired && <WeatherBoard />}
    </div>
  );
}

export default App;
