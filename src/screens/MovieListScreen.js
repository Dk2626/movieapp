import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Search from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';

const MovieListScreen = ({navigation}) => {
  const isMounted = useRef(false);
  const user = useSelector(state => state.user.user);
  const [keyboardShow, setKeyboardShow] = useState();
  const [movieLists, setMovieLists] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [freeTrial, setFreeTrial] = useState('');
  const [expireDate, setExpireDate] = useState('');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getMovieDetails = () => {
    setLoading(true);
    let list = [];
    database()
      .ref('moviesList')
      .on('value', snapshot => {
        if (isMounted.current) {
          snapshot.forEach(d => {
            list.push(d.val());
          });
          setMovieLists(list.reverse());
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = navigation.addListener('focus', () => {
      getMovieDetails();
    });
    return () => {
      unsubscribe;
      isMounted.current = false;
    };
  }, []);

  const filterMovie = () => {
    if (search) {
      let filter = movieLists.filter(movie =>
        movie.movieName
          .trim()
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      );
      return filter;
    } else {
      return movieLists;
    }
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

  const getUserExpireDate = () => {
    database()
      .ref('Users')
      .on('value', snapshot => {
        if (isMounted.current) {
          snapshot.forEach(d => {
            if (d.val().email == user) {
              setExpireDate(d.val().expireDate);
            }
          });
        }
      });
  };

  useEffect(() => {
    isMounted.current = true;
    getUserExpireDate();
    return () => {
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
          padding: 20,
        }}>
        <View style={{alignSelf: 'center'}}>
          <View
            style={{
              backgroundColor: '#191919',
              flexDirection: 'row',
              alignItems: 'center',
              width: windowWidth / 1.3,
              marginVertical: 10,
              borderRadius: 10,
            }}>
            <Search
              name="search"
              color="#f8d458"
              size={15}
              style={{paddingLeft: 10}}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor="grey"
              keyboardType="default"
              selectionColor="#f8d458"
              style={{
                width: '100%',
                paddingLeft: 10,
                fontFamily: 'Kanit-Regular',
                color: '#fff',
              }}
              value={search}
              onChangeText={value => setSearch(value)}
            />
          </View>
        </View>
        {filterMovie().length == 0 ? (
          <View style={{alignItems: 'center', paddingTop: 50}}>
            <Text
              style={{
                color: '#f8d458',
                fontFamily: 'Kanit-Regular',
                fontSize: 18,
              }}>
              No results found!
            </Text>
          </View>
        ) : (
          <View
            style={{
              height: keyboardShow ? windowHeight / 2 : windowHeight / 1.25,
            }}>
            <FlatList
              data={filterMovie()}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.movieName}
              renderItem={({item, index}) => {
                const {movieName, posterImg, director, rating, year} = item;
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      paddingVertical: 15,
                      paddingHorizontal: 5,
                      borderBottomColor: 'grey',
                      borderWidth: index == filterMovie().length - 1 ? 0 : 0.2,
                    }}
                    onPress={() =>
                      navigation.navigate('MovieMain', {
                        item,
                        freeTrial,
                        expireDate,
                      })
                    }>
                    <Image
                      source={{uri: posterImg}}
                      style={{
                        width: 100,
                        height: 150,
                        borderRadius: 10,
                        borderColor: '#f8d458',
                        borderWidth: 0.5,
                      }}
                    />
                    <View
                      style={{
                        paddingLeft: 20,
                        justifyContent: 'space-evenly',
                      }}>
                      <Text
                        style={{
                          color: '#f8d458',
                          fontFamily: 'Kanit-Regular',
                          fontSize: 20,
                          width: windowWidth / 2,
                        }}>
                        {movieName}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            color: 'grey',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          Year:{' '}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          {year}
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AntDesign name="star" color="#f8d458" size={15} />
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          {' '}
                          {rating}
                        </Text>
                        <Text
                          style={{
                            color: 'grey',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          /10
                        </Text>
                      </View>
                      <View
                        style={{flexDirection: 'row', width: windowWidth / 2}}>
                        <Text
                          style={{
                            color: 'grey',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          Director:{' '}
                        </Text>
                        <Text
                          style={{
                            color: '#fff',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 15,
                          }}>
                          {director}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
};

export default MovieListScreen;
