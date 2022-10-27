import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdminMainScreen, AdminAddEditScreen, AdminPlanScreen} from './index';
const Stack = createNativeStackNavigator();

const AdminScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="AdminMain" component={AdminMainScreen} />
      <Stack.Screen name="AdminAddEdit" component={AdminAddEditScreen} />
      <Stack.Screen name="AdminPlan" component={AdminPlanScreen} />
    </Stack.Navigator>
  );
};

export default AdminScreen;
