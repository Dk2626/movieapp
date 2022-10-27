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
  BackHandler,
  Modal,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Orientation from 'react-native-orientation-locker';
import Video, {TextTrackType} from 'react-native-video';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {SafeAreaView} from 'react-native-safe-area-context';
const windowWidth = Dimensions.get('window').width;
import AntDesign from 'react-native-vector-icons/AntDesign';
let overlayTimer;

const MovieMainScreen = ({navigation, route}) => {
  const {item, freeTrial, expireDate} = route.params;
  const {videoUrl, movieName, posterImg, cast, director, rating, year, desc} =
    item;
  const [Fullscreen, setFullscreen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentTime, setcurrentTime] = useState(0);
  const [duration, setduration] = useState(0.1);
  const playerRef = useRef();
  const [showControl, setshowControl] = useState(true);
  const [seek, setSeek] = useState(false);
  const [buffer, setBuffer] = useState(false);
  const [locked, setLocked] = useState(false);
  const [sub, setSub] = useState('');
  const [cc, setCc] = useState('index');
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    if (freeTrial == 'off' && !expireDate) {
      setPaused(true);
      setModalVisible(true);
    } else if (freeTrial == 'off' && date > expireDate) {
      setPaused(true);
      setModalVisible(true);
    }
  }, []);

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

  const FullscreenTogglee = () => {
    Orientation.lockToPortrait();
    StatusBar.setHidden(false);
    navigation.setOptions({headerShown: false});
    setFullscreen(false);
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', FullscreenTogglee);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', FullscreenTogglee);
  }, []);

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

  const load = data => {
    let filterSub = data.textTracks.filter(textTrack => {
      return textTrack.language == 'en';
    });
    setSub(filterSub[0]);
    setduration(data.duration);
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
              paddingHorizontal: 60,
              paddingVertical: 30,
            }}>
            {!expireDate && (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    fontFamily: 'Kanit-Regular',
                    marginBottom: 10,
                  }}>
                  You are not a Subscribe yet
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f8d458',
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    navigation.navigate('MovieList');
                    navigation.navigate('MoviePlan');
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontFamily: 'Kanit-Regular',
                    }}>
                    Subscribe Now!
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#000',
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    borderRadius: 10,
                    borderColor: '#f8d458',
                    borderWidth: 1,
                    marginBottom: 10,
                  }}
                  onPress={() => navigation.navigate('MovieList')}>
                  <Text
                    style={{
                      color: '#f8d458',
                      fontFamily: 'Kanit-Regular',
                    }}>
                    Back to Home
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {expireDate && (
              <>
                {date > expireDate && (
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        fontFamily: 'Kanit-Regular',
                        marginBottom: 10,
                      }}>
                      Your Subscription validity over
                    </Text>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#f8d458',
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        navigation.navigate('MovieList');
                        navigation.navigate('MoviePlan');
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontFamily: 'Kanit-Regular',
                        }}>
                        Subscribe Now!
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#000',
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 10,
                        borderColor: '#f8d458',
                        borderWidth: 1,
                        marginBottom: 10,
                      }}
                      onPress={() => navigation.navigate('MovieList')}>
                      <Text
                        style={{
                          color: '#f8d458',
                          fontFamily: 'Kanit-Regular',
                        }}>
                        Back to Home
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={Fullscreen ? styles.fullscreenVideo : styles.video}>
          {!sub == '' ? (
            <Video
              source={{
                uri: videoUrl,
              }}
              style={{...StyleSheet.absoluteFill}}
              resizeMode={'cover'}
              paused={paused}
              ref={playerRef}
              onLoadStart={onLoadStart}
              onLoad={load}
              onProgress={handleProgress}
              onBuffer={onBuffer}
              selectedTextTrack={{
                type: cc,
                value: 0,
              }}
              textTracks={[
                {
                  index: 0,
                  title: sub.title,
                  language: sub.language,
                  type: TextTrackType.SRT, // "application/x-subrip"
                  uri: 'https://durian.blender.org/wp-content/content/subtitles/sintel_es.srt',
                },
              ]}
            />
          ) : (
            <Video
              source={{
                uri: videoUrl,
              }}
              style={{...StyleSheet.absoluteFill}}
              resizeMode={'cover'}
              paused={paused}
              ref={playerRef}
              onLoadStart={onLoadStart}
              onLoad={load}
              onProgress={handleProgress}
              onBuffer={onBuffer}
            />
          )}
          {!locked ? (
            <>
              {showControl && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      paddingTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: Fullscreen ? 'space-between' : 'flex-end',
                    }}>
                    {Fullscreen && (
                      <View>
                        <Text
                          style={{
                            color: '#f8d458',
                            fontFamily: 'Kanit-Regular',
                            fontSize: 18,
                          }}>
                          {movieName}
                        </Text>
                      </View>
                    )}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {Fullscreen && (
                        <TouchableOpacity onPress={() => setLocked(true)}>
                          <Fontisto
                            name="locked"
                            style={{
                              fontSize: 21,
                              color: 'white',
                              marginRight: 15,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={FullscreenToggle}>
                        <Icon
                          name={Fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                          style={{
                            fontSize: Fullscreen ? 30 : 25,
                            color: 'white',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    {buffer ? (
                      <ActivityIndicator
                        color="#f8d458"
                        size={Fullscreen ? 40 : 25}
                      />
                    ) : (
                      <>
                        {!paused && (
                          <TouchableOpacity onPress={backward}>
                            <Icon
                              name="replay-5"
                              style={{
                                fontSize: Fullscreen ? 40 : 25,
                                color: 'white',
                              }}
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => setPaused(!paused)}>
                          <Icon
                            name={paused ? 'play-arrow' : 'pause'}
                            style={{
                              fontSize: Fullscreen ? 40 : 25,
                              color: '#f8d458',
                            }}
                          />
                        </TouchableOpacity>
                        {!paused && (
                          <TouchableOpacity onPress={forward}>
                            <Icon
                              name="forward-5"
                              style={{
                                fontSize: Fullscreen ? 40 : 25,
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
                      minimumTrackTintColor="#f8d458"
                      maximumTrackTintColor="#f8d458"
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
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: 'Kanit-Regular',
                          width: windowWidth / 7,
                          textAlign: 'center',
                        }}>
                        {getTime(currentTime)}
                      </Text>
                      {!sub == '' && (
                        <TouchableOpacity
                          style={{flexDirection: 'row', alignItems: 'center'}}
                          onPress={() => {
                            if (cc == 'index') {
                              setCc('disable');
                            } else if (cc == 'disable') {
                              setCc('index');
                            }
                          }}>
                          <Icon
                            name="subtitles"
                            style={{color: cc == 'index' ? '#f8d458' : 'grey'}}
                            size={20}
                          />
                          <Text
                            style={{
                              color: cc == 'index' ? '#f8d458' : 'grey',
                              fontFamily: 'Kanit-Regular',
                              marginLeft: 2,
                            }}>
                            Subtitle
                          </Text>
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          color: '#f8d458',
                          fontFamily: 'Kanit-Regular',
                          width: windowWidth / 7,
                          textAlign: 'center',
                        }}>
                        {getTime(duration)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </>
          ) : (
            <>
              {showControl && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15,
                    }}
                    onPress={() => setLocked(false)}>
                    <Fontisto
                      name="unlocked"
                      style={{
                        fontSize: 25,
                        color: '#f8d458',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
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
              source={{uri: posterImg}}
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
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                width: windowWidth / 1.2,
              }}>
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
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                width: windowWidth / 1.2,
              }}>
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
              width: windowWidth / 1.2,
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
