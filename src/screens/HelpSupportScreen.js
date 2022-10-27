import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import Textarea from 'react-native-textarea';
const windowWidth = Dimensions.get('window').width;
import Entypo from 'react-native-vector-icons/Entypo';
import DocumentPicker from 'react-native-document-picker';
import getPath from '@flyerhq/react-native-android-uri-path';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const HelpSupportScreen = ({navigation, route}) => {
  const userData = route.params;
  const [sub, setSub] = useState('');
  const [comment, setComment] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeIn, setActiveIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [subReq, setSubReq] = useState(false);
  const [commentReq, setCommentReq] = useState(false);
  const [fileNameReq, setFileNameReq] = useState(false);

  const chooseFile = async () => {
    const imageDetails = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    const path = await getPath(imageDetails[0].uri);
    await uploadFile(path, imageDetails[0].name);
  };

  const uploadFile = (file, name) => {
    setUploading(true);
    const uploadTask = storage().ref(`Quaries/${name}`).putFile(file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        storage()
          .ref(`Quaries/${name}`)
          .getDownloadURL()
          .then(url => {
            setProgress(0);
            setUploading(false);
            setFileUri(url);
            setFileName(name);
          });
      },
    );
  };

  const Submit = () => {
    setActiveIn(true);
    database()
      .ref('Quaries')
      .push({
        name: userData.name,
        email: userData.email,
        subject: sub,
        comment: comment,
        fileUri: fileUri,
      })
      .then(() => {
        setSub('');
        setComment('');
        setFileUri('');
        setFileName('');
        setActiveIn(false);
        setModalVisible(true);
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
        padding: 20,
        alignItems: 'center',
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
                fontSize: 18,
                marginBottom: 15,
                fontFamily: 'Kanit-Regular',
                width: windowWidth / 1.5,
                textAlign: 'center',
              }}>
              Your report have submitted successfully, Our team will get back to
              you soon!
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#f8d458',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
                marginHorizontal: 15,
              }}
              onPress={() => {
                navigation.navigate('User');
                navigation.navigate('MovieList');
              }}>
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Kanit-Regular',
                }}>
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{paddingVertical: 30}}>
        <Text
          style={{color: '#f8d458', fontFamily: 'Kanit-Regular', fontSize: 18}}>
          Help & Support
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#191919',
          flexDirection: 'row',
          alignItems: 'center',
          width: windowWidth / 1.2,
          marginTop: 10,
          marginBottom: subReq ? 0 : 10,
          borderRadius: 10,
        }}>
        <TextInput
          placeholder="Subject"
          placeholderTextColor="grey"
          keyboardType="default"
          selectionColor="#f8d458"
          style={{
            width: '100%',
            paddingLeft: 10,
            fontFamily: 'Kanit-Regular',
            color: '#fff',
          }}
          value={sub}
          onChangeText={value => {
            setSub(value);
            setSubReq(false);
          }}
          onBlur={() => {
            if (!sub) {
              setSubReq(true);
            }
          }}
        />
      </View>
      {subReq && (
        <Text
          style={{
            color: '#f8d458',
            fontFamily: 'Kanit-Regular',
            marginTop: 4,
            paddingLeft: 20,
            alignSelf: 'flex-start',
          }}>
          Subject required!
        </Text>
      )}
      <View
        style={{
          backgroundColor: '#191919',
          flexDirection: 'row',
          alignItems: 'center',
          width: windowWidth / 1.2,
          marginTop: 10,
          marginBottom: commentReq ? 0 : 10,
          borderRadius: 10,
        }}>
        <Textarea
          maxLength={5000}
          placeholder={'Comment'}
          placeholderTextColor={'grey'}
          selectionColor="#f8d458"
          style={{
            width: '100%',
            paddingLeft: 10,
            fontFamily: 'Kanit-Regular',
            color: '#fff',
          }}
          defaultValue={comment}
          onChangeText={value => {
            setComment(value);
            setCommentReq(false);
          }}
          onBlur={() => {
            if (!comment) {
              setCommentReq(true);
            }
          }}
        />
      </View>
      {commentReq && (
        <Text
          style={{
            color: '#f8d458',
            fontFamily: 'Kanit-Regular',
            marginTop: 4,
            paddingLeft: 20,
            alignSelf: 'flex-start',
          }}>
          Comment required!
        </Text>
      )}
      {!uploading ? (
        <View
          style={{
            alignSelf: 'flex-start',
            marginLeft: 15,
          }}>
          {!fileName ? (
            <>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f8d458',
                  flexDirection: 'row',
                  padding: 10,
                  alignItems: 'center',
                  borderRadius: 10,
                  marginTop: 10,
                  marginBottom: fileNameReq ? 0 : 10,
                }}
                onPress={() => {
                  setFileNameReq(false);
                  chooseFile();
                }}>
                <Entypo name="attachment" color="#000" size={16} />
                <Text
                  style={{
                    color: '#000',
                    fontFamily: 'Kanit-Regular',
                    marginLeft: 2,
                  }}>
                  Attach Screenshot
                </Text>
              </TouchableOpacity>
              {fileNameReq && (
                <Text
                  style={{
                    color: '#f8d458',
                    fontFamily: 'Kanit-Regular',
                    marginTop: 4,
                    paddingLeft: 7,
                    alignSelf: 'flex-start',
                  }}>
                  File required!
                </Text>
              )}
            </>
          ) : (
            <View
              style={{
                backgroundColor: '#f8d458',
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center',
                borderRadius: 10,
                marginVertical: 10,
              }}
              onPress={chooseFile}>
              <Entypo name="attachment" color="#000" size={16} />
              <Text
                style={{
                  color: '#000',
                  fontFamily: 'Kanit-Regular',
                  marginLeft: 2,
                }}>
                {fileName.slice(0, 30)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text
          style={{
            color: '#f8d458',
            alignSelf: 'flex-start',
            marginLeft: 15,
            fontFamily: 'Kanit-Regular',
            fontSize: 20,
          }}>
          Uploading {progress} %
        </Text>
      )}
      {!activeIn ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#f8d458',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 25,
          }}
          onPress={() => {
            if (!sub) {
              setSubReq(true);
            } else if (!comment) {
              setCommentReq(true);
            } else if (!fileName) {
              setFileNameReq(true);
            } else {
              Submit();
            }
          }}>
          <Text
            style={{color: '#000', fontFamily: 'Kanit-Regular', fontSize: 20}}>
            Submit
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            backgroundColor: '#f8d458',
            paddingVertical: 10,
            paddingHorizontal: 30,
            borderRadius: 10,
            marginTop: 25,
          }}>
          <ActivityIndicator color="#000" size={20} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HelpSupportScreen;
