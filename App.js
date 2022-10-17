import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {HomeScreen, UserScreen, LoginRegisterScreen} from './src/screens/index';
import {useDispatch, useSelector} from 'react-redux';
const Tab = createBottomTabNavigator();
import Octicons from 'react-native-vector-icons/Octicons';
import IconF from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from './src/features/user/userSlice';
import {View, ActivityIndicator} from 'react-native';
import {ref, get} from 'firebase/database';
import {database} from './src/firebase/firebase-config';

const App = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getFirebaseData = value => {
    setLoading(true);
    const db = database;
    get(ref(db, 'Users'))
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(d => {
            if (d.val().email === value) {
              dispatch(
                login({
                  name: d.val().name,
                  email: d.val().email,
                  expireDate: d.val().expireDate,
                }),
              );
            }
          });
        } else {
          console.log('No data availabe');
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getData = async () => {
    setLoading(true);
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        getFirebaseData(value);
      } else {
        dispatch(login(null));
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
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>
        <ActivityIndicator color="#f8d458" size={40} />
      </View>
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
              name="User"
              component={UserScreen}
              options={{
                tabBarIcon: ({color}) => (
                  <IconF name="user" color={color} size={18} />
                ),
              }}
            />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    );
  }
};

const getRouteName = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName?.includes('MovieMain') || routeName?.includes('MovieMain2')) {
    return 'none';
  } else {
    return 'flex';
  }
};

export default App;
