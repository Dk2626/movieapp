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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Search from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import AntDesign from 'react-native-vector-icons/AntDesign';

const movieLists = [
  {
    movieName: 'Vendhu Thanindhathu Kaadu',
    year: '2022',
    director: 'Gautham Vasudev Menon',
    rating: '7.8',
    cast: 'Silambarasan, Siddhi Idnani',
    desc: "Muthu, a low caste youngster, goes to the streets of Mumbai for a living. His quest takes him to a series of unexpected events, where he gets involved in the underground activities of Mumbai's Tamil gangsters. Will he get to the top?",
    img: 'https://m.media-amazon.com/images/M/MV5BZmJlZTMxNTItNjMyMS00YTNlLWEyODMtOTZkNjYwNjE4YjQ2XkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Vendhu+Thanindhathu+Kaadu.mp4',
  },

  {
    movieName: 'Thiruchitrambalam',
    year: '2022',
    director: 'Mithran Jawahar',
    rating: '8.0',
    cast: 'Dhanush, Nithya Menen',
    desc: 'Thiruchitrambalam lives with his father and grandfather. He blames the former for the loss of his mother and sister and is not on good terms with the latter. Meanwhile, his love life is not so successful.',
    img: 'https://m.media-amazon.com/images/M/MV5BYTNkNjQ4OTUtN2RjOS00NDU4LWI1MzItNWJlZjY2MmYxNDEyXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Thiruchitrambalm.mp4',
  },
  {
    movieName: 'Vikram',
    year: '2022',
    director: 'Lokesh Kanagaraj',
    rating: '8.4',
    cast: 'Kamal Haasan, Vijay Sethupathi, Fahadh Faasil',
    desc: 'A high-octane action film where a special investigator is assigned a case of serial Killings, he finds the case is not what it seems to be and leading down this path is only going to end in a war between everyone involved.',
    img: 'https://www.nowrunning.com/content/movie/2021/vikra-25471/Stills/vikram_2021115.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Vikram.mp4',
  },
  {
    movieName: 'Don',
    year: '2022',
    director: 'Cibi Chakravarthi',
    rating: '6.9',
    cast: 'Sivakarthikeyan, Priyanka Arulmohan, S.J. Suryah',
    desc: 'Follows the life of a youngster from college to his marriage.',
    img: 'https://tamil.samayam.com/photo/msid-91225704,imgsize-44044/pic.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Don.mp4',
  },
  {
    movieName: 'Cobra',
    year: '2022',
    director: 'R. Ajay Gnanamuthu',
    rating: '6.3',
    cast: 'Vikram, Irfan Pathan, Srinidhi Shetty',
    desc: 'A mathematician genius, Mathi, has another identity, Cobra, who commits intelligent crimes using math.',
    img: 'https://www.tamil2lyrics.com/wp-content/uploads/2020/06/Cobra-2020-Film.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Cobra.mp4',
  },
  {
    movieName: 'Master',
    year: '2021',
    director: 'Lokesh Kanagaraj',
    rating: '7.3',
    cast: 'Vijay, Vijay Sethupathi, Malavika Mohanan',
    desc: 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the school children for criminal activities.',
    img: 'https://m.media-amazon.com/images/M/MV5BODU0ZDE1ODMtZWIyMS00NzExLWIzOGMtN2M0ZDdhOTU1MWUzXkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg',
    url: 'https://s3.amazonaws.com/videoss.com/Master.mp4',
  },
];

const MovieListScreen = ({navigation}) => {
  const [keyboardShow, setKeyboardShow] = useState();

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
            style={{width: '100%', paddingLeft: 10}}
          />
        </View>
      </View>
      <View
        style={{height: keyboardShow ? windowHeight / 2 : windowHeight / 1.25}}>
        <FlatList
          data={movieLists}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.movieName}
          renderItem={({item, index}) => {
            const {movieName, img, cast, director, rating, year} = item;
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                  borderBottomColor: 'grey',
                  borderWidth: index == movieLists.length - 1 ? 0 : 0.2,
                }}
                onPress={() => navigation.navigate('MovieMain', {item})}>
                <Image
                  source={{uri: img}}
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  <View style={{flexDirection: 'row', width: windowWidth / 2}}>
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
                  {/* <View style={{flexDirection: 'row', width: windowWidth / 2}}>
                    <Text
                      style={{
                        color: 'grey',
                        fontFamily: 'Kanit-Regular',
                        fontSize: 15,
                      }}>
                      Cast:{' '}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Kanit-Regular',
                        fontSize: 15,
                      }}>
                      {cast}
                    </Text>
                  </View> */}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MovieListScreen;
