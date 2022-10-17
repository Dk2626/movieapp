import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect} from 'react';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconMail from 'react-native-vector-icons/Ionicons';
import IconLogout from 'react-native-vector-icons/MaterialIcons';
import {auth, database} from '../firebase/firebase-config';
import {signOut} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  const removeData = () => {
    AsyncStorage.removeItem('usertoken');
  };

  const Logout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logout());
        removeData();
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const getFirebaseData = value => {
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
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        getFirebaseData(value);
      } else {
        dispatch(login(null));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        padding: 20,
      }}>
      <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={Logout}>
        <IconLogout name="logout" size={27} color="#f8d458" />
      </TouchableOpacity>
      <View
        style={{
          borderRadius:
            Math.round(
              Dimensions.get('window').width + Dimensions.get('window').height,
            ) / 2,
          width: Dimensions.get('window').width * 0.3,
          height: Dimensions.get('window').width * 0.3,
          backgroundColor: '#f8d458',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{color: '#000', fontSize: 25, fontFamily: 'Kanit-Regular'}}>
          Hello!
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: 15}}>
        <Text
          style={{fontSize: 20, color: 'grey', fontFamily: 'Kanit-Regular'}}>
          User
        </Text>
        <IconUser
          name="user-alt"
          size={20}
          color="#f8d458"
          style={{marginVertical: 5}}
        />
        <Text
          style={{fontSize: 16, color: 'white', fontFamily: 'Kanit-Regular'}}>
          {user.name}
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: 15}}>
        <Text
          style={{fontSize: 20, color: 'grey', fontFamily: 'Kanit-Regular'}}>
          Email
        </Text>
        <IconMail
          name="mail"
          size={20}
          color="#f8d458"
          style={{marginVertical: 5}}
        />
        <Text
          style={{fontSize: 16, color: 'white', fontFamily: 'Kanit-Regular'}}>
          {user.email}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserScreen;
