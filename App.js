import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {
  HomeScreen,
  LoginRegisterScreen,
  AdminScreen,
  UserMainScreen,
} from './src/screens/index';
import {useDispatch, useSelector} from 'react-redux';
const Tab = createBottomTabNavigator();
import Octicons from 'react-native-vector-icons/Octicons';
import IconF from 'react-native-vector-icons/Feather';
import IconA from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login, logout} from './src/features/user/userSlice';
import {SafeAreaView, ActivityIndicator} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        dispatch(login(value));
        setLoading(false);
      } else {
        dispatch(logout());
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>
        <ActivityIndicator color="#f8d458" size={40} />
      </SafeAreaView>
    );
  } else {
    return (
      <NavigationContainer>
        {!user ? (
          <LoginRegisterScreen />
        ) : (
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarStyle: {
                backgroundColor: '#191919',
                height: 60,
                position: 'absolute',
                bottom: 16,
                right: 40,
                left: 40,
                borderRadius: 20,
                borderTopWidth: 0,
              },
              tabBarInactiveTintColor: 'grey',
              tabBarActiveTintColor: '#f8d458',
            }}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={({route}) => ({
                tabBarStyle: {
                  display: getRouteName(route),
                  backgroundColor: '#191919',
                  height: 60,
                  position: 'absolute',
                  bottom: 16,
                  right: 40,
                  left: 40,
                  borderRadius: 20,
                  borderTopWidth: 0,
                },
                tabBarIcon: ({color}) => (
                  <Octicons name="home" color={color} size={18} />
                ),
              })}
            />
            <Tab.Screen
              name="UserMain"
              component={UserMainScreen}
              options={({route}) => ({
                tabBarStyle: {
                  display: getRouteName(route),
                  backgroundColor: '#191919',
                  height: 60,
                  position: 'absolute',
                  bottom: 16,
                  right: 40,
                  left: 40,
                  borderRadius: 20,
                  borderTopWidth: 0,
                },
                tabBarIcon: ({color}) => (
                  <IconF name="user" color={color} size={18} />
                ),
              })}
            />
            {user == 'dineshkumardssd@gmail.com' && (
              <Tab.Screen
                name="Admin"
                component={AdminScreen}
                options={({route}) => ({
                  tabBarStyle: {
                    display: getRouteName(route),
                    backgroundColor: '#191919',
                    height: 60,
                    position: 'absolute',
                    bottom: 16,
                    right: 40,
                    left: 40,
                    borderRadius: 20,
                    borderTopWidth: 0,
                  },
                  tabBarIcon: ({color}) => (
                    <IconA name="user-secret" color={color} size={18} />
                  ),
                })}
              />
            )}
          </Tab.Navigator>
        )}
      </NavigationContainer>
    );
  }
};

const getRouteName = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (
    routeName?.includes('MovieMain') ||
    routeName?.includes('Help') ||
    routeName?.includes('Plan') ||
    routeName?.includes('AdminAddEdit') ||
    routeName?.includes('AdminPlan')
  ) {
    return 'none';
  } else {
    return 'flex';
  }
};

export default App;
