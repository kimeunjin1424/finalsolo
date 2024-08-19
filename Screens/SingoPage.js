import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontAwesome5 } from '@expo/vector-icons'
import { FontAwesome6 } from '@expo/vector-icons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import * as ImagePicker from 'expo-image-picker'
import { useSelector } from 'react-redux'

const SingoPage = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { userId, user } = useSelector((state) => state.user)

  const [coner, setConer] = useState('client')
  const [pickImages, setPickImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [photoLength, setPhotoLength] = useState()
  const [text, setText] = useState('')
  const [reply, setReply] = useState('')
  const [singos, setSingos] = useState([])
  const [mySingo, setMySingo] = useState([])
  //const [jobs, setJobs] = useState([])

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    //setPickImages('')
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      // mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    })

    console.log('uri', result.assets.length)
    setPhotoLength(result.assets.length)

    if (!result.canceled) {
      for (i = 0; i < result.assets.length; i++) {
        setPickImages((prev) => [...prev, result.assets[i].uri])
      }
    }
    console.log('userImageurl', pickImages)
  }

  const sendImages = () => {
    let formData = new FormData()
    for (i = 0; i < pickImages.length; i++) {
      const newImageUri = 'file:///' + pickImages[i].split('file:/').join('')
      const sImage = {
        uri: newImageUri,
        type: 'image/*',
        name: newImageUri.split('/').pop(),
      }
      //multiple file을 보낼때는 'file'이라는 동일한 이름에
      //for문을 써서 넣든지, map을 써던지 해야함.
      //이거때메 3일 날림 ㅠ
      formData.append(`images`, sImage)
    }
    console.log('sendImages', sendImages)
    //formData.append('image', sendImages)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        //Authorization: `Bearer ${token}`,
      },
    }
    setIsLoading(true)
    axios
      .post(`${baseUrl}/api/user/upload-profile-images`, formData, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log('res', res.data.imageUrls)
          console.log('res', res.data.imageUrls.length)
          for (i = 0; i < res.data.imageUrls.length; i++) {
            setImageUrls((prev) => [...prev, res.data.imageUrls[i].url])
            console.log(res.data.imageUrls[i].url)
          }
          setIsLoading(false)
          Alert.alert('Success', '이미지가 성공적으로 업로드 되었습니다.', [
            { text: 'OK' },
          ])
        }
      })
      .catch((error) => {
        console.log('Image Upload Failed', error)
      })
  }

  const deletePicture = (url) => {
    console.log(url)
    setPickImages(pickImages.filter((i) => i !== url))
  }

  const createSingo = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/singo/create-singo`, {
          userId,
          username: route.params.username,
          text,
          imageUrl: imageUrls,
        })
        .then((res) => {
          console.log('trsdfs', res)
          if (res.status === 200) {
            Alert.alert(
              'Success',
              '신고가 완료되었습니다. 처리하는데 1~5일 정도 시간이 걸립니다.'
            )
            navigation.goBack()
            // Handle success, such as updating UI or showing a success message
          } else {
            console.error('create-Singo to create match')
            // Handle failure, such as showing an error message
          }
        })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  // const verifyJob = async (userId, jobName, jobId) => {
  //   try {
  //     await axios
  //       .post(`${baseUrl}/api/job/verify-job`, {
  //         userId,
  //         jobName,
  //         jobId,
  //       })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           Alert.alert('Success', '직업 인증이 완료되었습니다. ')
  //           getJobs()
  //           // Handle success, such as updating UI or showing a success message
  //         } else {
  //           console.error('직업인증 실패 to create match')
  //           // Handle failure, such as showing an error message
  //         }
  //       })
  //   } catch (error) {
  //     console.error('직업인증실패  creating match:', error)
  //     // Handle error, such as showing an error message
  //   }
  // }

  const getSingos = async () => {
    try {
      await axios.get(`${baseUrl}/api/singo/get-singos`).then((res) => {
        if (res.status === 200) {
          setSingos(res.data.singo)
          console.log('get singos', res.data.singo)
        }
      })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const getMySingo = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/singo/get-singo`, { userId })
        .then((res) => {
          if (res.status === 200) {
            console.log('mysingo', res.data.singo)
            setMySingo(res.data.singo)
          }
        })
    } catch (error) {
      console.error('get My singo error', error)
      // Handle error, such as showing an error message
    }
  }

  const inputReply = async (singoId) => {
    try {
      await axios
        .put(`${baseUrl}/api/singo/singo-reply`, {
          singoId,
          reply,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert('Success', '신고 답글 달기가 성공했습니다.')
            setReply('')
          }
        })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const singoDelete = async (singoId) => {
    try {
      await axios
        .post(`${baseUrl}/api/singo/delete-singo`, {
          singoId,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert('Success', '신고 삭제가 잘 되었습니다.')
            getSingos()
          }
        })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, padding: 5, width: '100%' }}
      keyboardVerticalOffset={20}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={{ marginTop: 30 }}
      >
        <ScrollView>
          <View
            style={{
              marginTop: 35,
              marginLeft: 20,
              flexDirection: 'row',
              marginBottom: 10,
            }}
          >
            <TouchableOpacity activeOpacity={0.8} style={{}}>
              <MaterialCommunityIcons
                name="arrow-left-circle"
                size={45}
                color="#581845"
                style={{ marginTop: 5 }}
                onPress={() => navigation.navigate('Profile')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConer('client')}
              style={{
                marginTop: 10,
                marginHorizontal: 5,
                borderWidth: 1,
                borderRadius: 25,
                borderColor: '#581845',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  alignSelf: 'center',
                  fontSize: 30,
                  color: '#581845',
                }}
              >
                신고하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConer('result')
                getMySingo()
              }}
              style={{
                marginTop: 10,
                marginHorizontal: 5,
                borderWidth: 1,
                borderRadius: 25,
                borderColor: '#581845',
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Se-Hwa',
                  alignSelf: 'center',
                  fontSize: 30,
                  color: '#581845',
                }}
              >
                신고 결과 보기
              </Text>
            </TouchableOpacity>
            {user.admin == 'true' && (
              <TouchableOpacity
                onPress={() => {
                  setConer('admin')
                  getSingos()
                }}
                style={{ alignSelf: 'center', marginTop: 5, marginLeft: 10 }}
              >
                <AntDesign name="checkcircleo" size={40} color="red" />
              </TouchableOpacity>
            )}
          </View>
          {coner == 'client' && (
            <View style={{ marginTop: 10, marginHorizontal: 10 }}>
              <View>
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}
                >
                  1.허위 인물, 광고 인물, AI인물 신고하기
                </Text>
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}
                >
                  2.욕설, 폭력적 언어, 성매매 유도 신고하기
                </Text>
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}
                >
                  3.금전적 거래 요구 신고하기
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: 'black',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'black' }}
                >
                  -1~3번 중에 어느 하나라도 해당되면, 증거내용을 캡쳐 해서
                  신고해 주시면, 하트를 10개 드립니다.
                </Text>
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'black' }}
                >
                  -맑고 깨끗하고, 신뢰할 수 있는 나 혼자 솔로를 위해서 많은 협조
                  부탁드립니다.
                </Text>
              </View>
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <View>
                  <Text
                    style={{
                      color: 'gray',
                      fontFamily: 'Se-Hwa',
                      fontSize: 25,
                    }}
                  >
                    {' '}
                    1.신고내용 입력하기
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: 'gray',
                      padding: 10,
                      borderRadius: 15,
                      marginTop: 10,
                      backgroundColor: 'white',
                    }}
                  >
                    <TextInput
                      onChangeText={(text) => setText(text)}
                      style={{ fontSize: 25, fontFamily: 'Se-Hwa', height: 90 }}
                      placeholder="신고내용 입력하기.. "
                      placeholderTextColor="lightgray"
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                    />
                  </View>
                </View>
              </View>
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <Text
                  style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 25 }}
                >
                  {' '}
                  2. 증거사진 올리기 (3장까지 가능)
                </Text>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 10,
                    borderRadius: 15,
                    marginTop: 10,
                    backgroundColor: 'white',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      alignSelf: 'center',
                      color: 'black',
                      fontSize: 25,
                    }}
                  >
                    인증 사진 선택하기
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: 20,
                  }}
                >
                  {pickImages.slice(0, 3).map((url, index) => (
                    <Pressable
                      onPress={() => deletePicture(url)}
                      key={index}
                      style={{
                        borderColor: '#581845',
                        borderWidth: url ? 0 : 2,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderStyle: 'dashed',
                        borderRadius: 10,
                        height: 100,
                      }}
                    >
                      {url ? (
                        <>
                          <Image
                            source={{ uri: url }}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: 10,
                              resizeMode: 'cover',
                            }}
                          />
                          <View
                            style={{ position: 'absolute', top: 10, right: 10 }}
                          >
                            <AntDesign
                              name="closecircleo"
                              size={24}
                              color="white"
                            />
                          </View>
                        </>
                      ) : (
                        <EvilIcons name="image" size={22} color="black" />
                      )}
                    </Pressable>
                  ))}
                </View>
                <View style={{ marginTop: 10 }}>
                  {pickImages && pickImages.length > 0 ? (
                    <TouchableOpacity onPress={sendImages}>
                      <View
                        style={{
                          marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          borderWidth: 2,
                          borderColor: 'gray',
                          justifyContent: 'space-around',
                          borderRadius: 25,
                        }}
                      >
                        <Text
                          style={{
                            color: 'gray',
                            textAlign: 'center',
                            fontSize: 25,
                            fontFamily: 'Se-Hwa',
                            marginBottom: 8,
                          }}
                        >
                          증거사진 업로드하기
                        </Text>
                        <AntDesign name="checkcircleo" size={30} color="gray" />
                      </View>
                      <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20 }}>
                        증거사진 업로드 후 신고가 가능합니다.
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {imageUrls.length > 0 && (
                    <TouchableOpacity onPress={createSingo}>
                      <View
                        style={{
                          marginVertical: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                          borderWidth: 2,
                          borderColor: 'red',
                          justifyContent: 'space-around',
                          borderRadius: 25,
                        }}
                      >
                        <Text
                          style={{
                            color: 'red',
                            textAlign: 'center',
                            fontSize: 25,
                            fontFamily: 'Se-Hwa',
                            marginBottom: 8,
                          }}
                        >
                          신고하기
                        </Text>
                        <AntDesign name="checkcircleo" size={30} color="red" />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                {isLoading && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.35)',
                      flex: 1,
                    }}
                  >
                    <ActivityIndicator size="large" color="white" />
                    <Text
                      style={{
                        fontFamily: 'Se-Hwa',
                        color: 'white',
                        fontSize: 50,
                      }}
                    >
                      다소 시간이 걸릴 수 있습니다.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          {coner == 'admin' && (
            <View style={{ marginBottom: 20, paddingVertical: 20 }}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 300,
                }}
              >
                {singos &&
                  singos?.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 5,
                        borderRadius: 15,
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.username}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.text}
                        </Text>
                      </View>
                      {i.imageUrl?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            marginVertical: 10,
                            alignItems: 'center',
                            marginHorizontal: 5,
                          }}
                        >
                          <Image
                            style={{
                              width: '90%',
                              height: 350,
                              resizeMode: 'cover',
                              borderRadius: 10,
                            }}
                            source={{
                              uri: item,
                            }}
                          />
                        </View>
                      ))}
                      <View
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'lightgray',
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                          }}
                        >
                          {i.reply}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                        }}
                      >
                        <TextInput
                          value={reply}
                          onChangeText={(text) => setReply(text)}
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                          }}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => inputReply(i._id)}
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                          backgroundColor: 'gray',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                            color: 'white',
                          }}
                        >
                          결과 입력하기
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => singoDelete(i._id)}
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'white',
                          paddingVertical: 5,
                          backgroundColor: 'red',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                            color: 'white',
                          }}
                        >
                          삭제하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
          {coner == 'result' && (
            <View style={{ marginBottom: 20, paddingVertical: 20 }}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 300,
                }}
              >
                {mySingo &&
                  mySingo?.map((i, index) => (
                    <View
                      key={index}
                      style={{
                        borderWidth: 1,
                        marginHorizontal: 5,
                        borderRadius: 15,
                        marginTop: 10,
                        marginBottom: 20,
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.username}
                        </Text>
                      </View>
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa' }}>
                          {i.text}
                        </Text>
                      </View>
                      {i.imageUrl?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            marginVertical: 10,
                            alignItems: 'center',
                            marginHorizontal: 5,
                          }}
                        >
                          <Image
                            style={{
                              width: '90%',
                              height: 350,
                              resizeMode: 'cover',
                              borderRadius: 10,
                            }}
                            source={{
                              uri: item,
                            }}
                          />
                        </View>
                      ))}
                      <View
                        style={{
                          marginHorizontal: 5,
                          marginVertical: 5,
                          borderWidth: 1,
                          borderRadius: 15,
                          backgroundColor: 'lightgray',
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            textAlign: 'center',
                            fontFamily: 'Se-Hwa',
                          }}
                        >
                          {i.reply}
                        </Text>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default SingoPage

const styles = StyleSheet.create({})
