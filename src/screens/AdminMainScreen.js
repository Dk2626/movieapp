import {
  SafeAreaView,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Search from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database from '@react-native-firebase/database';

const AdminMainScreen = ({navigation}) => {
  const isMounted = useRef(false);
  const [keyboardShow, setKeyboardShow] = useState();
  const [movieLists, setMovieLists] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
            list.push({
              id: d.key,
              movieName: d.val().movieName,
              year: d.val().year,
              rating: d.val().rating,
              director: d.val().director,
              cast: d.val().cast,
              desc: d.val().desc,
              posterImg: d.val().posterImg,
              videoUrl: d.val().videoUrl,
            });
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('AdminPlan')}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                fontSize: 18,
              }}>
              Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#f8d458',
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('AdminAddEdit', {item: ''})}>
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                fontSize: 18,
              }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
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
              height: keyboardShow ? windowHeight / 2.2 : windowHeight / 1.3,
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
                    onPress={() => navigation.navigate('AdminAddEdit', {item})}>
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

export default AdminMainScreen;
