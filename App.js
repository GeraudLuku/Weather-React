import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import * as location from 'expo-location';

import WeatherInfo from './components/WeatherInfo.js';
import UnitPicker from './components/UnitPicker';
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import {colors} from './utils/index';

const WEATHER_API_KEY = 'c29a17192b18dc3bea8eeb505999ae9e';
const BASE_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?`;

export default function App () {
  const [errorMessage, setErrorMessage] = useState (null);
  const [currentWeather, setCurrentWeather] = useState (null);
  const [unitSystem, setUnitSystem] = useState ('metric');

  // useEffect is called when module is first started or called example onStart()
  useEffect (
    () => {
      load ();
    },
    [unitSystem] //anytime the unit system is changed, he load function is called
  );

  //get current location function
  const load = async () => {
    setCurrentWeather (null);
    setErrorMessage (null);
    try {
      //request location permission
      let {status} = await location.requestPermissionsAsync ();

      //check is permission was granted
      if (status !== 'granted') {
        setErrorMessage ('Access to Location was Denied');
        return;
      } else {
        //get current location
        const loc = await location.getCurrentPositionAsync ();

        //separate lat and long from object
        const {latitude, longitude} = loc.coords;

        //make request to OpenWeather API
        const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&units=${unitSystem}&lon=${longitude}&appid=${WEATHER_API_KEY}`;
        const response = await fetch (weatherUrl);

        //convert response to json
        const result = await response.json ();
        if (response.ok) setCurrentWeather (result);
        else setErrorMessage ('Error Fetching Current Weather');

        //prompt lat and long to user
        //alert (`latitude : ${latitude}, longitude : ${longitude}`);
      }
    } catch (error) {
      setErrorMessage (error);
    }
  };

  //if current weather is not null
  if (currentWeather) {
    const {main: {temp}} = currentWeather;

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <UnitPicker unitsSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>

        <WeatherDetails
          currentWeather={currentWeather}
          unitSystem={unitSystem}
        />

      </View>
    );
  } else if (errorMessage) {
    //show error view
    return (
      <View style={styles.container}>
        <ReloadIcon load={load} />
        <Text style={{textAlign: 'center'}}>{errorMessage}</Text>
        <StatusBar style="auto" />
      </View>
    );
  } else {
    //show loading screen when screen is not ready
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
});
