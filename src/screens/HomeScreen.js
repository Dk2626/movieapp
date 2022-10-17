import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MovieListScreen, MovieMainScreen} from './index';
const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MovieList" component={MovieListScreen} />
      <Stack.Screen name="MovieMain" component={MovieMainScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
