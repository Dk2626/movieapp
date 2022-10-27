import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import database from '@react-native-firebase/database';
const windowWidth = Dimensions.get('window').width;

const AdminPlanScreen = ({navigation}) => {
  const isMounted = useRef(false);
  const [yearPlan, setYearPlan] = useState('');
  const [monthPlan, setMonthPlan] = useState('');
  const [freeTrial, setFreeTrial] = useState('');
  const [activeInY, setActiveInY] = useState(false);
  const [activeInM, setActiveInM] = useState(false);
  const [activeInF, setActiveInF] = useState(false);

  const storeYearPlan = () => {
    setActiveInY(true);
    database()
      .ref('yearPlan/-NFNEuNb0dz1at3qju0c')
      .set({
        yearPlan,
      })
      .then(() => {
        setYearPlan('');
        setActiveInY(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const storeMonthPlan = () => {
    setActiveInM(true);
    database()
      .ref('monthPlan/-NFNGi2Ke-5wkIitFiiZ')
      .set({
        monthPlan,
      })
      .then(() => {
        setMonthPlan('');
        setActiveInM(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const storeFreeTrial = data => {
    setActiveInF(true);
    database()
      .ref('freetrial/-NFNKzPNYEeNk4ZaNOn0')
      .set({
        freeTrial: data,
      })
      .then(() => {
        setFreeTrial('');
        setActiveInF(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const getfreeTrial = () => {
    database()
      .ref('freetrial')
      .on('value', snapshot => {
        if (isMounted.current) {
          snapshot.forEach(d => {
            setFreeTrial(d.val().freeTrial);
          });
        }
      });
  };

  useEffect(() => {
    isMounted.current = true;
    getfreeTrial();
    return () => {
      isMounted.current = false;
    };
  }, []);

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
          flexDirection: 'row',
          alignItems: 'center',
          width: windowWidth / 1.2,
          marginVertical: 10,
          borderRadius: 10,
        }}>
        <TextInput
          placeholder="Year Plan"
          placeholderTextColor="grey"
          keyboardType="default"
          selectionColor="#f8d458"
          style={{
            width: '100%',
            paddingLeft: 10,
            fontFamily: 'Kanit-Regular',
            color: '#fff',
          }}
          value={yearPlan}
          onChangeText={value => setYearPlan(value)}
        />
      </View>
      {!activeInY ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={storeYearPlan}>
          <Text
            style={{
              color: '#000',
              fontFamily: 'Kanit-Regular',
            }}>
            Update
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#000" size={20} />
        </TouchableOpacity>
      )}
      <View
        style={{
          backgroundColor: '#191919',
          flexDirection: 'row',
          alignItems: 'center',
          width: windowWidth / 1.2,
          marginVertical: 10,
          borderRadius: 10,
        }}>
        <TextInput
          placeholder="Month Plan"
          placeholderTextColor="grey"
          keyboardType="default"
          selectionColor="#f8d458"
          style={{
            width: '100%',
            paddingLeft: 10,
            fontFamily: 'Kanit-Regular',
            color: '#fff',
          }}
          value={monthPlan}
          onChangeText={value => setMonthPlan(value)}
        />
      </View>
      {!activeInM ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={storeMonthPlan}>
          <Text
            style={{
              color: '#000',
              fontFamily: 'Kanit-Regular',
            }}>
            Update
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingHorizontal: 30,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <ActivityIndicator color="#000" size={20} />
        </TouchableOpacity>
      )}
      {!activeInF ? (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
            margin: 100,
            borderColor: '#f8d458',
            borderWidth: 0.8,
            padding: 10,
            borderRadius: 10,
          }}
          onPress={() =>
            freeTrial == 'on' ? storeFreeTrial('off') : storeFreeTrial('on')
          }>
          <Text
            style={{
              fontFamily: 'Kanit-Regular',
              color: '#f8d458',
              fontSize: 30,
            }}>
            Free trial - {freeTrial == 'on' ? 'off' : 'on'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            alignSelf: 'flex-start',
            margin: 100,
            borderColor: '#f8d458',
            borderWidth: 0.8,
            padding: 10,
            paddingHorizontal: 80,
            borderRadius: 10,
          }}>
          <ActivityIndicator color="#f8d458" size={20} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default AdminPlanScreen;
