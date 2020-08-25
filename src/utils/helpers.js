export function getCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(0);
}

export function getFahrenheit(kelvin) {
  return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

export function getTemperature(kelvin, unit) {
  if (unit === "c") {
    return getCelsius(kelvin);
  } else {
    return getFahrenheit(kelvin);
  }
}
