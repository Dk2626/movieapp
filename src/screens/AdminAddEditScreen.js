import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Textarea from 'react-native-textarea';
import Trash from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';

const AdminAddEditScreen = ({navigation, route}) => {
  const {item} = route.params;
  const [movieDetail, setMovieDetail] = useState({
    movieName: item.movieName ? item.movieName : '',
    year: item.year ? item.year : '',
    director: item.director ? item.director : '',
    rating: item.rating ? item.rating : '',
    posterImg: item.posterImg ? item.posterImg : '',
    videoUrl: item.videoUrl ? item.videoUrl : '',
    cast: item.cast ? item.cast : '',
    desc: item.desc ? item.desc : '',
  });
  const {movieName, year, director, rating, posterImg, videoUrl, cast, desc} =
    movieDetail;
  const [activeIn, setActiveIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const storeMovieDetails = () => {
    setActiveIn(true);
    database()
      .ref('moviesList')
      .push({
        movieName,
        year,
        director,
        rating,
        posterImg,
        videoUrl,
        cast,
        desc,
      })
      .then(() => {
        setMovieDetail({
          movieName: '',
          year: '',
          director: '',
          rating: '',
          posterImg: '',
          videoUrl: '',
          cast: '',
          desc: '',
        });
        setActiveIn(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const updateMovieDetails = () => {
    setActiveIn(true);
    database()
      .ref(`moviesList/${item.id}`)
      .set({
        movieName,
        year,
        director,
        rating,
        posterImg,
        videoUrl,
        cast,
        desc,
      })
      .then(() => {
        setMovieDetail({
          movieName: '',
          year: '',
          director: '',
          rating: '',
          posterImg: '',
          videoUrl: '',
          cast: '',
          desc: '',
        });
        setActiveIn(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const deleteMovieDetails = () => {
    setActiveIn(true);
    database()
      .ref(`moviesList/${item.id}`)
      .remove()
      .then(() => {
        setActiveIn(false);
        setModalVisible(false);
        navigation.navigate('AdminMain');
      })
      .catch(err => console.log('err', err));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#191919',
              borderRadius: 10,
              padding: 40,
            }}>
            <Text
              style={{
                color: '#f8d458',
                fontSize: 16,
                marginBottom: 15,
                fontFamily: 'Kanit-Regular',
              }}>
              Are you sure you want to delete?
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  borderColor: '#f8d458',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginHorizontal: 15,
                }}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    color: '#f8d458',

                    fontFamily: 'Kanit-Regular',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              {!activeIn ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f8d458',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 15,
                    borderColor: '#f8d458',
                    borderWidth: 1,
                    padding: 10,
                  }}
                  onPress={deleteMovieDetails}>
                  <Text style={{color: '#000', fontFamily: 'Kanit-Regular'}}>
                    Delete
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f8d458',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 15,
                    borderColor: '#f8d458',
                    borderWidth: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                  }}>
                  <ActivityIndicator color="#000" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 30,
          height: windowHeight / 0.62,
        }}
        showsVerticalScrollIndicator={false}>
        {item.id && (
          <TouchableOpacity
            style={{alignSelf: 'flex-end', padding: 15}}
            onPress={() => setModalVisible(!modalVisible)}>
            <Trash name="trash-can" size={20} color="#f8d458" />
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
            placeholder="Movie name"
            placeholderTextColor="grey"
            keyboardType="default"
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            value={movieName}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                movieName: value,
              })
            }
          />
        </View>
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
            placeholder="Year"
            placeholderTextColor="grey"
            keyboardType="default"
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            value={year}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                year: value,
              })
            }
          />
        </View>
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
            placeholder="Rating"
            placeholderTextColor="grey"
            keyboardType="default"
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            value={rating}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                rating: value,
              })
            }
          />
        </View>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Textarea
            maxLength={5000}
            placeholder={'Director'}
            placeholderTextColor={'grey'}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            defaultValue={director}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                director: value,
              })
            }
          />
        </View>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Textarea
            maxLength={5000}
            placeholder={'Cast'}
            placeholderTextColor={'grey'}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            defaultValue={cast}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                cast: value,
              })
            }
          />
        </View>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Textarea
            maxLength={5000}
            placeholder={'Description'}
            placeholderTextColor={'grey'}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            defaultValue={desc}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                desc: value,
              })
            }
          />
        </View>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Textarea
            maxLength={5000}
            placeholder={'Poster Image Url'}
            selectionColor="#f8d458"
            placeholderTextColor={'grey'}
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            defaultValue={posterImg}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                posterImg: value,
              })
            }
          />
        </View>
        <View
          style={{
            backgroundColor: '#191919',
            flexDirection: 'row',
            alignItems: 'center',
            width: windowWidth / 1.2,
            marginVertical: 10,
            borderRadius: 10,
          }}>
          <Textarea
            maxLength={5000}
            placeholder={'Movie Url'}
            placeholderTextColor={'grey'}
            selectionColor="#f8d458"
            style={{
              width: '100%',
              paddingLeft: 10,
              fontFamily: 'Kanit-Regular',
              color: '#fff',
            }}
            defaultValue={videoUrl}
            onChangeText={value =>
              setMovieDetail({
                ...movieDetail,
                videoUrl: value,
              })
            }
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={() => {
            if (item.id) {
              updateMovieDetails();
            } else {
              storeMovieDetails();
            }
          }}>
          {!activeIn ? (
            <Text
              style={{
                color: '#000',
                fontFamily: 'Kanit-Regular',
                fontSize: 16,
              }}>
              {item.id ? 'Update' : 'Add'}
            </Text>
          ) : (
            <ActivityIndicator color="#000" size={20} />
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAddEditScreen;
