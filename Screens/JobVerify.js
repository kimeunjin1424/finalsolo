import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Pressable,
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

const JobVerify = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { userId, user } = useSelector((state) => state.user)

  const [coner, setConer] = useState('client')
  const [pickImages, setPickImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [photoLength, setPhotoLength] = useState()
  const [jobName, setJobName] = useState('')
  const [comment, setComment] = useState('')
  const [jobs, setJobs] = useState([])

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

  const jobVerify = async () => {
    try {
      await axios
        .post(`${baseUrl}/api/job/job-verify`, {
          userId,
          username: route.params.username,
          jobName,
          imageUrls,
        })
        .then((res) => {
          console.log('trsdfs', res)
          if (res.status === 200) {
            Alert.alert(
              'Success',
              '직업 인증 신청이 완료되었습니다. 1~5일 정도 시간이 걸립니다.'
            )
            navigation.goBack()
            // Handle success, such as updating UI or showing a success message
          } else {
            console.error('job verify to create match')
            // Handle failure, such as showing an error message
          }
        })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const verifyJob = async (userId, jobName, jobId) => {
    try {
      await axios
        .post(`${baseUrl}/api/job/verify-job`, {
          userId,
          jobName,
          jobId,
        })
        .then((res) => {
          if (res.status === 200) {
            Alert.alert('Success', '직업 인증이 완료되었습니다. ')
            getJobs()
            // Handle success, such as updating UI or showing a success message
          } else {
            console.error('직업인증 실패 to create match')
            // Handle failure, such as showing an error message
          }
        })
    } catch (error) {
      console.error('직업인증실패  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  const getJobs = async () => {
    try {
      await axios.get(`${baseUrl}/api/job/get-jobs`).then((res) => {
        if (res.status === 200) {
          setJobs(res.data.job)
          console.log('jobssssssss', res.data.job)
        }
      })
    } catch (error) {
      console.error('job verify  creating match:', error)
      // Handle error, such as showing an error message
    }
  }

  return (
    <SafeAreaView>
      <View
        style={{
          marginTop: 5,
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
            marginHorizontal: 10,
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
            직업 인증하기
          </Text>
        </TouchableOpacity>
        {user.admin == 'true' && (
          <TouchableOpacity
            onPress={() => {
              setConer('admin')
              getJobs()
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
            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
              1.2024년 중 어느 한 달의 월급명세서{' '}
            </Text>
            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
              2.재직증명서 3.신분증과 명함{' '}
            </Text>

            <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}>
              4.사원증과 명함 5.학생일 경우 학생증
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
              -1번~5번 중 하나를 사진으로 올려주세요. 올릴때는 반드시 이름과
              주민번호는 가리고 올려주세요!!
            </Text>
            <Text
              style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'black' }}
            >
              -인증 후 데이터(사진)는 바로 삭제되며, 카드 옆에 직업이 같이
              나타납니다.
            </Text>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <View>
              <Text
                style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 25 }}
              >
                {' '}
                1.직업명 혹은 회사이름 입력하기
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
                  onChangeText={(text) => setJobName(text)}
                  style={{ fontSize: 25, fontFamily: 'Se-Hwa' }}
                  placeholder="공무원, LG전자, 현대차등등.. "
                  placeholderTextColor="lightgray"
                />
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <Text style={{ color: 'gray', fontFamily: 'Se-Hwa', fontSize: 25 }}>
              {' '}
              2. 사진 업로드하기 (3장까지 가능)
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
                      인증사진 업로드하기
                    </Text>
                    <AntDesign name="checkcircleo" size={30} color="gray" />
                  </View>
                  <Text style={{ fontFamily: 'Se-Hwa', fontSize: 20 }}>
                    인증사진 업로드 후 인증 신청이 가능합니다.
                  </Text>
                </TouchableOpacity>
              ) : null}
              {imageUrls.length > 0 && (
                <TouchableOpacity onPress={jobVerify}>
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
                      직업 인증 신청하기
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
                <ActivityIndicator size={100} />
                <Text
                  style={{ fontFamily: 'Se-Hwa', color: 'white', fontSize: 50 }}
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
            {jobs &&
              jobs.map((i, index) => (
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
                      {i.jobName}
                    </Text>
                  </View>
                  {i.imageUrls?.map((item, index) => (
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
                  <TouchableOpacity
                    onPress={() => verifyJob(i.userId, i.jobName, i._id)}
                    style={{
                      marginHorizontal: 5,
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 15,
                      backgroundColor: 'white',
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        textAlign: 'center',
                        fontFamily: 'Se-Hwa',
                      }}
                    >
                      직업 인증하기
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  )
}

export default JobVerify

const styles = StyleSheet.create({})
