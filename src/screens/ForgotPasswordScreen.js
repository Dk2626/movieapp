import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from '../firebase/firebase-config';
const windowWidth = Dimensions.get('window').width;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailReq, setEmailReq] = useState(false);
  const [invalidEmailPass, setInvalidEmailPass] = useState(false);

  const ForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
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
              setEmail(value);
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
            style={{color: '#000', fontFamily: 'Kanit-Regular', fontSize: 20}}>
            Change password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
