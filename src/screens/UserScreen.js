import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import IconUser from 'react-native-vector-icons/FontAwesome5';
import IconMail from 'react-native-vector-icons/Ionicons';
import IconLogout from 'react-native-vector-icons/MaterialIcons';
import Phone from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const UserScreen = ({navigation}) => {
  const isMounted = useRef(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const {name, email, expireDate} = userData;
  const [date, setDate] = useState(new Date().toLocaleDateString());

  const removeData = () => {
    AsyncStorage.removeItem('usertoken');
  };

  const Logout = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(logout());
        removeData();
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const getFirebaseData = () => {
    setLoading(true);
    database()
      .ref('Users')
      .on('value', snapshot => {
        if (isMounted.current) {
          snapshot.forEach(d => {
            if (d.val().email === user) {
              setUserData({
                name: d.val().name,
                email: d.val().email,
                expireDate: d.val().expireDate,
              });
              setLoading(false);
            }
          });
        }
      });
  };

  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = navigation.addListener('focus', () => {
      getFirebaseData();
    });
    return () => {
      unsubscribe;
      isMounted.current = false;
    };
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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000',
        }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            padding: 20,
            // height: windowHeight / 0.9,
          }}>
          <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={Logout}>
            <IconLogout name="logout" size={27} color="#f8d458" />
          </TouchableOpacity>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../img/logo.png')}
              style={{width: 80, height: 80}}
            />
            <Text
              style={{
                fontFamily: 'Kanit-Regular',
                color: '#fff',
                fontSize: 25,
              }}>
              Moviez On
            </Text>
          </View>
          <Text
            style={{
              color: '#f8d458',
              fontSize: 25,
              fontFamily: 'Kanit-Regular',
              paddingTop: 30,
            }}>
            Hello!
          </Text>
          <View style={{alignItems: 'center', marginVertical: 15}}>
            <Text
              style={{
                fontSize: 20,
                color: 'grey',
                fontFamily: 'Kanit-Regular',
              }}>
              User
            </Text>
            <IconUser
              name="user-alt"
              size={20}
              color="#f8d458"
              style={{marginVertical: 5}}
            />
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'Kanit-Regular',
              }}>
              {name}
            </Text>
          </View>
          <View style={{alignItems: 'center', marginVertical: 15}}>
            <Text
              style={{
                fontSize: 20,
                color: 'grey',
                fontFamily: 'Kanit-Regular',
              }}>
              Email
            </Text>
            <IconMail
              name="mail"
              size={20}
              color="#f8d458"
              style={{marginVertical: 5}}
            />
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'Kanit-Regular',
              }}>
              {email}
            </Text>
          </View>
          {!expireDate && (
            <View style={{alignItems: 'center', marginVertical: 15}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'Kanit-Regular',
                  marginBottom: 5,
                }}>
                You are not a Subscribe yet
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f8d458',
                  paddingVertical: 15,
                  paddingHorizontal: 30,
                  borderRadius: 10,
                }}
                onPress={() => navigation.navigate('Plan')}>
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Kanit-Regular',
                    marginLeft: 2,
                  }}>
                  Subscribe Now!
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {expireDate && (
            <>
              {date < expireDate ? (
                <View style={{alignItems: 'center', marginVertical: 15}}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: 'grey',
                      fontFamily: 'Kanit-Regular',
                    }}>
                    Subscription Valid till
                  </Text>
                  <IconMail
                    name="timer"
                    size={22}
                    color="#f8d458"
                    style={{marginVertical: 5}}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'white',
                      fontFamily: 'Kanit-Regular',
                    }}>
                    {expireDate}
                  </Text>
                </View>
              ) : (
                <View style={{alignItems: 'center', marginVertical: 15}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 16,
                      fontFamily: 'Kanit-Regular',
                      marginBottom: 5,
                    }}>
                    Your Subscription validity over
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#f8d458',
                      paddingVertical: 15,
                      paddingHorizontal: 30,
                      borderRadius: 10,
                    }}
                    onPress={() => navigation.navigate('Plan')}>
                    <Text
                      style={{
                        color: '#000',
                        fontFamily: 'Kanit-Regular',
                        marginLeft: 2,
                      }}>
                      Subscribe Now!
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          <TouchableOpacity
            style={{marginTop: 50, alignItems: 'center'}}
            onPress={() => navigation.navigate('Help', userData)}>
            <Phone name="old-phone" color="#f8d458" size={15} />
            <Text
              style={{
                color: '#f8d458',
                fontFamily: 'Kanit-Regular',
                fontSize: 16,
                marginTop: 5,
              }}>
              Help & Support
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default UserScreen;
