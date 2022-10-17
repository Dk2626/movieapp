import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {signInWithEmailAndPassword} from 'firebase/auth';
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {auth} from '../firebase/firebase-config';
import {login} from '../features/user/userSlice';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [emailReq, setEmailReq] = useState(false);
  const [passwordReq, setPasswordReq] = useState(false);
  const [invalidEmailPass, setInvalidEmailPass] = useState(false);

  const {email, password} = userInput;

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('usertoken', value);
    } catch (error) {
      console.log('error', error);
    }
  };

  const LoginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(res => {
        dispatch(login(res.user.email));
        storeData(res.user.email);
      })
      .catch(err => {
        console.log('err', err.message);
        setInvalidEmailPass(true);
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
          Login
        </Text>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginTop: 10,
            marginBottom: emailReq ? 0 : 10,
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
              setInvalidEmailPass(false);
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
            value={password}
            onChangeText={value => {
              setUserInput({
                ...userInput,
                password: value,
              });
              setPasswordReq(false);
              setInvalidEmailPass(false);
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
        {invalidEmailPass && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
              textAlign: 'center',
            }}>
            Invalid email / Wrong password!
          </Text>
        )}
        <TouchableOpacity
          style={{alignItems: 'flex-end', marginVertical: 10}}
          onPress={() => navigation.navigate('Forgot')}>
          <Text style={{fontFamily: 'Kanit-Regular', color: '#fff'}}>
            Forgot password?
          </Text>
        </TouchableOpacity>
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
            if (!email) {
              setEmailReq(true);
            } else if (password.length < 6) {
              setPasswordReq(true);
            } else {
              LoginUser();
            }
          }}>
          <Text
            style={{color: '#000', fontFamily: 'Kanit-Regular', fontSize: 20}}>
            Login
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 10,
          }}>
          <Text style={{fontFamily: 'Kanit-Regular', color: '#fff'}}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#f8d458', fontFamily: 'Kanit-Regular'}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
