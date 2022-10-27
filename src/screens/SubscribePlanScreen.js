import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const windowWidth = Dimensions.get('window').width;

const SubscribePlanScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        paddingTop: 50,
      }}>
      <View
        style={{
          backgroundColor: '#191919',
          width: windowWidth / 1.2,
          borderRadius: 10,
          padding: 10,
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontFamily: 'Kanit-Regular',
            color: '#f8d458',
            fontSize: 30,
          }}>
          Annual Plan
        </Text>
        <Text
          style={{
            fontFamily: 'Kanit-Regular',
            color: '#fff',
            paddingTop: 10,
          }}>
          Unlimited 12 Months access to 100% Tamil Movies
        </Text>
        <View
          style={{
            borderTopWidth: 1.2,
            borderColor: '#f8d458',
            borderStyle: 'dashed',
            marginVertical: 20,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5 name="rupee-sign" color="#fff" />
            <Text
              style={{
                fontFamily: 'Kanit-Regular',
                color: '#fff',
                marginLeft: 5,
              }}>
              149 / Year
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                marginLeft: 2,
              }}>
              Subscribe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#191919',
          width: windowWidth / 1.2,
          borderRadius: 10,
          padding: 10,
        }}>
        <Text
          style={{
            fontFamily: 'Kanit-Regular',
            color: '#f8d458',
            fontSize: 30,
          }}>
          Quarterly Plan
        </Text>
        <Text
          style={{
            fontFamily: 'Kanit-Regular',
            color: '#fff',
            paddingTop: 10,
          }}>
          Unlimited 3 Months access to 100% Tamil Movies
        </Text>
        <View
          style={{
            borderTopWidth: 1.2,
            borderColor: '#f8d458',
            borderStyle: 'dashed',
            marginVertical: 20,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5 name="rupee-sign" color="#fff" />
            <Text
              style={{
                fontFamily: 'Kanit-Regular',
                color: '#fff',
                marginLeft: 5,
              }}>
              59 / 3 Months
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                marginLeft: 2,
              }}>
              Subscribe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubscribePlanScreen;
