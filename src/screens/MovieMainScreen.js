import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState, useRef} from 'react';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
const windowWidth = Dimensions.get('window').width;
import AntDesign from 'react-native-vector-icons/AntDesign';
let overlayTimer;

const MovieMainScreen = ({navigation, route}) => {
  const {item} = route.params;
  const {url, movieName, img, cast, director, rating, year, desc} = item;
  const [Fullscreen, setFullscreen] = useState(false);
  const [paused, setPaused] = useState(true);
  const [currentTime, setcurrentTime] = useState(0);
  const [duration, setduration] = useState(0.1);
  const playerRef = useRef();
  const [showControl, setshowControl] = useState(true);
  const [seek, setSeek] = useState(false);
  const [buffer, setBuffer] = useState(false);

  const showControls = () => {
    setshowControl(!showControl);
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => setshowControl(false), 3000);
  };

  const FullscreenToggle = () => {
    if (Fullscreen) {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
      navigation.setOptions({headerShown: false});
      setFullscreen(false);
    } else {
      Orientation.lockToLandscape();
      StatusBar.setHidden(true);
      navigation.setOptions({headerShown: false});
      setFullscreen(true);
    }
  };

  const backward = () => {
    playerRef.current.seek(currentTime - 5);
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => setshowControl(false), 3000);
  };

  const forward = () => {
    playerRef.current.seek(currentTime + 5);
    clearTimeout(overlayTimer);
    overlayTimer = setTimeout(() => setshowControl(false), 3000);
  };

  const handleProgress = ({currentTime}) => {
    if (!seek) {
      setcurrentTime(currentTime);
    }
  };

  const onLoadStart = () => {
    setBuffer(true);
  };

  const load = ({duration}) => {
    setduration(duration);
    setBuffer(false);
  };

  const onBuffer = ({isBuffering}) => {
    setBuffer(isBuffering ? true : false);
  };

  const getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return hr + ':' + min + ':' + sec;
    // return min + ':' + sec;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={Fullscreen ? styles.fullscreenVideo : styles.video}>
          <Video
            source={{uri: url}}
            style={{...StyleSheet.absoluteFill}}
            resizeMode={'cover'}
            paused={paused}
            ref={playerRef}
            onLoadStart={onLoadStart}
            onLoad={load}
            onProgress={handleProgress}
            onBuffer={onBuffer}
          />
          {showControl && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#000000c4',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={FullscreenToggle}
                style={{
                  alignSelf: 'flex-end',
                  paddingTop: 15,
                  paddingRight: 15,
                }}>
                <Icon
                  name={Fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                  style={{fontSize: Fullscreen ? 30 : 25, color: 'white'}}
                />
              </TouchableOpacity>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                {buffer ? (
                  <ActivityIndicator
                    color="white"
                    size={Fullscreen ? 30 : 25}
                  />
                ) : (
                  <>
                    {!paused && (
                      <TouchableOpacity onPress={backward}>
                        <Icon
                          name="replay-5"
                          style={{
                            fontSize: Fullscreen ? 30 : 25,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => setPaused(!paused)}>
                      <Icon
                        name={paused ? 'play-arrow' : 'pause'}
                        style={{fontSize: Fullscreen ? 30 : 25, color: 'white'}}
                      />
                    </TouchableOpacity>
                    {!paused && (
                      <TouchableOpacity onPress={forward}>
                        <Icon
                          name="forward-5"
                          style={{
                            fontSize: Fullscreen ? 30 : 25,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
              <View style={{margin: 20}}>
                <Slider
                  style={{marginBottom: 5}}
                  minimumTrackTintColor="white"
                  maximumTrackTintColor="white"
                  thumbTintColor="white"
                  minimumValue={0}
                  maximumValue={100}
                  value={(currentTime / duration) * 100}
                  onValueChange={value => {
                    setcurrentTime((value * duration) / 100);
                  }}
                  onSlidingStart={() => setSeek(true)}
                  onSlidingComplete={value => {
                    setSeek(false);
                    playerRef.current.seek((value * duration) / 100);
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: 'white'}}>{getTime(currentTime)}</Text>
                  <Text style={{color: 'white'}}>{getTime(duration)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {!Fullscreen && (
        <View
          style={{
            flex: 1,
            backgroundColor: '#000',
            padding: 30,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={{uri: img}}
              style={{
                width: 150,
                height: 200,
                borderRadius: 10,
                borderColor: '#f8d458',
                borderWidth: 0.5,
              }}
            />
            <View style={{paddingLeft: 20, paddingVertical: 20}}>
              <Text
                style={{
                  color: '#f8d458',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 20,
                  width: windowWidth / 2,
                }}>
                {movieName}
              </Text>
              <View style={{flexDirection: 'row', paddingVertical: 10}}>
                <Text
                  style={{
                    color: 'grey',
                    fontFamily: 'Kanit-Regular',
                    fontSize: 18,
                  }}>
                  Year:{' '}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Kanit-Regular',
                    fontSize: 18,
                  }}>
                  {year}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <AntDesign name="star" color="#f8d458" size={20} />
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 25,
                }}>
                {' '}
                {rating}
              </Text>
              <Text
                style={{
                  color: 'grey',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 20,
                }}>
                /10
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <Text
                style={{
                  color: 'grey',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 18,
                }}>
                Director:{' '}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 18,
                }}>
                {director}
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <Text
                style={{
                  color: 'grey',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 18,
                }}>
                Cast:{' '}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 18,
                }}>
                {cast}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontFamily: 'Kanit-Regular',
              fontSize: 18,
              color: '#fff',
              paddingVertical: 10,
            }}>
            {desc}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MovieMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: windowWidth,
    height: windowWidth * 0.6,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    backgroundColor: 'black',
    ...StyleSheet.absoluteFill,
    elevation: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 25,
  },
  TextStyle: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 100,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  sliderCont: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
});
