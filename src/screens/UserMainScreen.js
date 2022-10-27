import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {UserScreen, HelpSupportScreen, SubscribePlanScreen} from './index';
const Stack = createNativeStackNavigator();

const UserMainScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Help" component={HelpSupportScreen} />
      <Stack.Screen name="Plan" component={SubscribePlanScreen} />
    </Stack.Navigator>
  );
};

export default UserMainScreen;
