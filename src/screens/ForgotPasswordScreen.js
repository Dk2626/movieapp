import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
const windowWidth = Dimensions.get('window').width;

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [invalidEmailPass, setInvalidEmailPass] = useState(false);
  const [mailSent, setMailSent] = useState(false);
  const [activeIn, setActiveIn] = useState(false);

  const ForgotPassword = () => {
    setActiveIn(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setMailSent(true);
        setActiveIn(false);
      })
      .catch(err => {
        console.log('err', err);
        setInvalidEmailPass(true);
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
          Change password
        </Text>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginTop: 10,
            marginBottom: invalidEmailPass ? 0 : 10,
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
              setEmail(value);
              setInvalidEmailPass(false);
              setMailSent(false);
            }}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
          />
        </View>
        {invalidEmailPass && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
            }}>
            Email doesn't exist!
          </Text>
        )}
        {mailSent && (
          <Text
            style={{
              color: '#f8d458',
              fontFamily: 'Kanit-Regular',
              marginTop: 3,
              paddingLeft: 4,
              width: windowWidth / 1.3,
            }}>
            Password reset have sent to your email, kindly check spam folder
            also!
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
            onPress={() => ForgotPassword()}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                fontSize: 20,
              }}>
              Change password
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
            Go back?{' '}
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

export default ForgotPasswordScreen;
