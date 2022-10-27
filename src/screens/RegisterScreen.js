import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
const windowWidth = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {login} from '../features/user/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const RegisterScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [nameReq, setNameReq] = useState(false);
  const [emailReq, setEmailReq] = useState(false);
  const [passwordReq, setPasswordReq] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [activeIn, setActiveIn] = useState(false);

  const {name, email, password} = userInput;

  const storeUser = () => {
    database().ref('Users').push({
      name,
      email,
      registerDate: new Date().toLocaleDateString(),
      expireDate: '',
    });
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('usertoken', value);
    } catch (error) {
      console.log('error', error);
    }
  };

  const RegisterUser = () => {
    setActiveIn(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('res', res);
        dispatch(login(res.user.email));
        storeData(res.user.email);
        storeUser();
        setActiveIn(false);
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          setEmailExist(true);
        }
        if (err.code === 'auth/invalid-email') {
          setInvalidEmail(true);
        }
        setActiveIn(false);
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
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
      <View>
        <Text
          style={{
            color: '#f8d458',
            alignSelf: 'flex-start',
            fontSize: 25,
            fontFamily: 'Kanit-Regular',
          }}>
          Register
        </Text>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginTop: 10,
            marginBottom: nameReq ? 0 : 10,
            borderRadius: 10,
          }}>
          <IconF
            name="user"
            color="#f8d458"
            size={15}
            style={{paddingLeft: 10}}
          />
          <TextInput
            keyboardType="default"
            placeholder="Name"
            placeholderTextColor="grey"
            value={name}
            onChangeText={value => {
              setUserInput({
                ...userInput,
                name: value,
              });
              setNameReq(false);
            }}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            onBlur={() => {
              if (name.length == 0) {
                setNameReq(true);
              }
            }}
          />
        </View>
        {nameReq && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Name required!
          </Text>
        )}
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginTop: 10,
            marginBottom: emailReq || invalidEmail || emailExist ? 0 : 10,
            borderRadius: 10,
          }}>
          <Icon
            name="email-outline"
            color="#f8d458"
            size={15}
            style={{paddingLeft: 10}}
          />
          <TextInput
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="grey"
            value={email}
            onChangeText={value => {
              setUserInput({
                ...userInput,
                email: value,
              });
              setEmailReq(false);
              setInvalidEmail(false);
              setEmailExist(false);
            }}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            onBlur={() => {
              if (email.length == 0) {
                setEmailReq(true);
              }
            }}
          />
        </View>
        {emailReq && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Email required!
          </Text>
        )}
        {invalidEmail && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Invalid email!
          </Text>
        )}
        {emailExist && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Email already exists!
          </Text>
        )}
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginTop: 10,
            marginBottom: passwordReq ? 0 : 10,
            borderRadius: 10,
          }}>
          <Icon
            name="lock"
            color="#f8d458"
            size={15}
            style={{paddingLeft: 10}}
          />
          <TextInput
            keyboardType="default"
            placeholder="Password"
            placeholderTextColor="grey"
            plac
            value={password}
            onChangeText={value => {
              setUserInput({
                ...userInput,
                password: value,
              });
              setPasswordReq(false);
            }}
            secureTextEntry={hidePassword}
            selectionColor="#f8d458"
            style={{
              width: '84%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            onBlur={() => {
              if (password.length < 6) {
                setPasswordReq(true);
              }
            }}
          />
          <Icon
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            color="#f8d458"
            size={15}
            onPress={() => setHidePassword(!hidePassword)}
          />
        </View>
        {passwordReq && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Atleast 6 characters
          </Text>
        )}
        {!activeIn ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              marginHorizontal: 50,
              marginVertical: 10,
              alignItems: 'center',
              paddingVertical: 15,
              borderRadius: 10,
            }}
            onPress={() => {
              if (!name) {
                setNameReq(true);
              } else if (!email) {
                setEmailReq(true);
              } else if (password.length < 6) {
                setPasswordReq(true);
              } else if (!emailExist) {
                RegisterUser();
              }
            }}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                fontSize: 20,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              marginHorizontal: 50,
              marginVertical: 10,
              alignItems: 'center',
              paddingVertical: 15,
              borderRadius: 10,
            }}>
            <ActivityIndicator color="#000" size={20} />
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Text style={{fontFamily: 'Kanit-Regular', color: '#fff'}}>
            Have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{color: '#f8d458', fontFamily: 'Kanit-Regular'}}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
