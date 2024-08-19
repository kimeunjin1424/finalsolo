import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import 'core-js/stable/atob'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { jwtDecode } from 'jwt-decode'
import Carousel from 'react-native-reanimated-carousel'
import { SimpleLineIcons } from '@expo/vector-icons'
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker'
import { useIsFocused } from '@react-navigation/native'
import { FontAwesome6 } from '@expo/vector-icons'
import Animated from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome5 } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { addToUser, removeToken } from '../slices/userSlice'
import { FontAwesome } from '@expo/vector-icons'

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const { token, userId, user } = useSelector((state) => state.user)

  console.log('userId_profilePage', userId)
  const navigation = useNavigation()
  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height
  const isFocused = useIsFocused()

  const regionData = [
    { id: 1, name: '서울' },
    { id: 2, name: '경기도' },
    { id: 3, name: '충북' },
    { id: 4, name: '충남' },
    { id: 5, name: '강원' },
    { id: 6, name: '광주전남' },
    { id: 7, name: '전북' },
    { id: 8, name: '경남' },
    { id: 9, name: '경북' },
    { id: 10, name: '부산울산' },
    { id: 11, name: '제주' },
  ]

  const [image, setImage] = useState()
  const [isModalVisible, setModalVisible] = useState(false)
  const [question, setQuestion] = useState('')
  const [holder, setHolder] = useState('')
  const [age, setAge] = useState('')
  const [region, setRegion] = useState(user.region)
  const [email, setEmail] = useState('')
  const [lookingFor, setLookingFor] = useState(user.lookingFor)
  const [gender, setGender] = useState(user.gender)
  const [images, setImages] = useState([])
  const [pickImages, setPickImages] = useState([])
  const [photoLength, setPhotoLength] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [prompts, setPrompts] = useState('')
  const [questionModal, setQuestionModal] = useState(false)
  const [questionItem, setQuestionItem] = useState('')
  const [questionRe, setQuestionRe] = useState('')
  const [questionId, setQuestionId] = useState('')
  const [updateAnswer, setUpdateAnnswer] = useState('')
  const [updateEmail, setUpdateEmail] = useState('')
  const [updateGender, setUpdateGender] = useState('')
  const [updateRegion, setUpdateRegion] = useState('')
  const [updateLookingFor, setUpdateLookginFor] = useState('')
  const [updateImageUrls, setUpdateImageUrls] = useState('')
  const [updateAge, setUpdateAge] = useState('')
  const [uploadImageButton, setUploadImageButton] = useState(false)
  const [status, setStatus] = useState('')
  const [updateStatus, setUpdateStatus] = useState('')
  const [savePeople, setSavePeople] = useState([])
  const [emailModal, setEmailModal] = useState(false)
  const [ageModal, setAgeModal] = useState(false)
  const [regionModal, setRegionModal] = useState(false)
  const [lookingForModal, setLookingForModal] = useState(false)
  const [statusModal, setStatusModal] = useState(false)
  const [promptModal, setPromptModal] = useState(false)
  const [imageModal, setImageModal] = useState(false)

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

    //console.log('uri', result.assets.length)
    setPhotoLength(result.assets.length)

    if (!result.canceled) {
      if (result.assets.length == null) {
        console.log('image null')
      } else {
        for (i = 0; i < result.assets.length; i++) {
          setPickImages((prev) => [...prev, result.assets[i].uri])
        }
      }
    }
    //console.log('userImageurl', pickImages)
  }

  const logout = async () => {
    await AsyncStorage.removeItem('hinge_token').then(() => {
      dispatch(removeToken())
      navigation.navigate('AuthStack', { screen: 'Login' })
    })
  }

  const fetchUser = async () => {
    console.log('fetch User')
    await axios
      .post(`${baseUrl}/api/user/user-profile`, { userId })
      .then((res) => {
        dispatch(addToUser(res.data.user))
        setImage(res.data.user.imageUrls[0])
        setImages(res.data.user.imageUrls)
        setPrompts(res.data.user.prompts)
        setSavePeople(res.data.user.saveProfiles)

        //console.log('res', res.data.user)
      })
      .catch((err) => console.log('profile Error_Profile Page', err))
  }

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, isFocused])

  const openModal = (title, item) => {
    setQuestion(title)
    setHolder(item)
    setModalVisible(!isModalVisible)
  }

  const deletePicture = (url) => {
    setImages(images.filter((i) => i !== url))
  }

  const deletePick = (url) => {
    setPickImages(pickImages.filter((i) => i !== url))
  }

  const sendImages = () => {
    if (images.length + pickImages.length < 7) {
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
      //console.log('sendImages', sendImages)
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
            for (i = 0; i < res.data.imageUrls.length; i++) {
              setImages((prev) => [...prev, res.data.imageUrls[i].url])
              console.log(
                `${res.data.imageUrls[i].url}`,
                res.data.imageUrls[i].url
              )
            }
            setIsLoading(false)
            setUploadImageButton(true)
            // Alert.alert('Success', '이미지가 성공적으로 업데이트 되었습니다.', [
            //   {
            //     text: '확인',
            //     onPress: () => {
            //       console.log('images.....', images)
            //       //imageUrlsUpdate()
            //       setModalVisible(false)
            //       setPickImages('')
            //     },
            //   },
            // ])
          }
        })
        .catch((error) => {
          console.log('Image Upload Failed', error)
        })
    } else {
      Alert.alert('실패', '이미지는 6장까지 업로드 가능합니다.', [
        {
          text: 'OK',
          onPress: () => {},
        },
      ])
    }
  }

  const promptUpdate = async () => {
    console.log('questionId', questionId)
    await axios
      .put(`${baseUrl}/api/user/update-prompts`, {
        questionId,
        updateAnswer,
        userId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '질문 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setQuestionModal(false)
                  setPromptModal(true)
                  setUpdateAnnswer('')
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const emailUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-email`, {
        updateEmail,
        userId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            'Email 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setEmailModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const ageUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-age`, {
        userId,
        updateAge,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '나이 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setAgeModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const genderUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-gender`, {
        userId,
        updateGender,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '성별 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setModalVisible(!isModalVisible)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const statusUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-status`, {
        userId,
        updateStatus,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '상태 업데이트가 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setStatusModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const regionUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-region`, {
        userId,
        updateRegion,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '지역 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setRegionModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const imageUrlsUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-imageUrls`, {
        userId,
        images,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          setUploadImageButton(false)
          setPickImages('')
          Alert.alert(
            '성공',
            '이미지 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setImageModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }
  const lookingForUpdate = async () => {
    await axios
      .put(`${baseUrl}/api/user/update-lookingFor`, {
        userId,
        updateLookingFor,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert(
            '성공',
            '데이팅 타입 수정/답변이 완료되었습니다. OK를 눌러주세요.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setLookingForModal(false)
                  fetchUser()
                },
              },
            ]
          )
        }
      })
  }

  const deleteSaveProfile = async (selectedUserId) => {
    await axios
      .post(`${baseUrl}/api/user/delete-save-profile`, {
        userId,
        selectedUserId,
      })
      .then((res) => {
        console.log(res.data.status)
        if (res.data.status === true) {
          Alert.alert('성공', '삭제가 완료되었습니다. OK를 눌러주세요.', [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(!isModalVisible)
                fetchUser()
              },
            },
          ])
        }
      })
  }

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <SafeAreaView
        style={{
          backgroundColor: 'white',
          flex: 1,
          marginTop: 50,
          backgroundColor: 'transparent',
        }}
      >
        <View
          style={{
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderRadius: 30,
              padding: 10,
              backgroundColor: 'pink',
              borderColor: 'white',
              gap: 10,
              width: '90%',
              marginHorizontal: 'auto',
            }}
          >
            <Text
              style={{
                fontFamily: 'Ga-Ram',
                fontSize: 40,
                color: 'black',
                textAlign: 'center',
              }}
            >
              나 혼자 솔로
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            marginTop: 5,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <MaterialCommunityIcons
              name="alarm-light-outline"
              size={24}
              color="gray"
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Singo', { username: user.name })
              }
            >
              <Text style={{ marginTop: 3, color: 'gray' }}>신고하기</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 10,
              marginLeft: 10,
            }}
          >
            <FontAwesome name="hand-o-up" size={20} color="gray" />
            <TouchableOpacity onPress={() => navigation.navigate('Suggest')}>
              <Text style={{ color: 'gray', marginTop: 3 }}>건의하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 1, width: '90%' }}>
          <Carousel
            loop
            width={width}
            height={width}
            autoPlay={true}
            //data={[...new Array(6).keys()]}
            data={images}
            mode="parallax"
            scrollAnimationDuration={2000}
            //onSnapToItem={(index) => console.log(' index:', index)}
            renderItem={({ index, item }) => (
              <View
                style={{
                  justifyContent: 'center',
                  resizeMode: 'cover',
                  borderRadius: 25,
                }}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: item }}
                />
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              setImageModal(true)
            }}
            style={{
              borderWidth: 1,
              borderRadius: 25,
              marginHorizontal: 'auto',
              paddingVertical: 5,
              paddingHorizontal: 35,
              marginTop: -10,
              borderColor: 'gray',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Se-Hwa',
                fontSize: 25,
                color: 'gray',
              }}
            >
              이미지 수정하기
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            width: width * 0.9,
            marginHorizontal: 'auto',
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 15,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              이름 : <Text style={{ color: 'black' }}>{user.name}</Text>
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              이메일 :{' '}
              <Text style={{ color: 'black' }}>{email || user.email}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setEmailModal(true)}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              나이 :{' '}
              <Text style={{ color: 'black' }}>{age || user.age} 세</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setAgeModal(true)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              사는곳 :{' '}
              <Text style={{ color: 'black' }}>{region || user.region}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setRegionModal(true)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              데이팅 목적 :{' '}
              <Text style={{ color: 'black' }}>
                {lookingFor || user.lookingFor} 를 찾아요
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setLookingForModal(true)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              성별 :{' '}
              <Text style={{ color: 'black' }}>{gender || user.gender}</Text>
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                openModal('Gender', user.gender)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              남은 하트갯수:{' '}
              <Text style={{ color: 'black' }}>{user.heartCount} 개</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChargeHeart', { user })}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
                gap: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                display: 'flex',
                alignContent: 'center',
                alignSelf: 'center',
              }}
            >
              <SimpleLineIcons
                style={{ textAlign: 'auto' }}
                name="pencil"
                size={24}
                color="gray"
              />
              <Text
                style={{ color: 'gray', fontSize: 20, fontFamily: 'Se-Hwa' }}
              >
                (충전하기)
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              현재 상태 :{' '}
              <Text style={{ color: 'black' }}>{status || user?.status}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setStatusModal(true)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              추가질문 수정하기
            </Text>
            <TouchableOpacity
              onPress={() => {
                setPromptModal(true)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              받은 누적 하트 갯수 :
            </Text>
            <View style={{ marginTop: 5 }}>
              <AntDesign name="hearto" size={24} color="gray" />
            </View>
            <Text
              style={{
                fontFamily: 'Se-Hwa',
                fontSize: 25,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              {user.receviedHeartCount}개
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              찜한 사람 보기
            </Text>
            <View style={{ marginTop: 5 }}>
              <AntDesign name="hearto" size={24} color="gray" />
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SavePeople', { savePeople })
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              차단 시킨 사람 보기
            </Text>
            <View style={{ marginTop: 5 }}>
              <FontAwesome6 name="face-angry" size={24} color="gray" />
            </View>
            <TouchableOpacity
              onPress={() => {
                openModal('Prompts', user.prompts)
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              color: 'gray',
              padding: 10,
              borderColor: 'gray',
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 25, color: 'gray', fontFamily: 'Se-Hwa' }}>
              직업 인증하기
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('JobVerify', { username: user.name })
              }}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 2,
                borderRadius: 5,
              }}
            >
              <SimpleLineIcons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          onPress={logout}
          style={{
            borderColor: 'black',
            marginTop: 10,
            padding: 12,
            borderRadius: 30,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 120,
            marginBottom: 20,
            flexDirection: 'row',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Se-Hwa',
              fontSize: 30,
              fontWeight: '500',
              marginBottom: 5,
            }}
          >
            Log out
          </Text>
        </Pressable>
      </SafeAreaView>
      {/* email Modal */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={emailModal}
        onTouchOutside={() => {
          setEmailModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: 300,
              height: 400,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                새로운 Email을 입력하세요.
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 25,
                  padding: 5,
                  borderColor: 'lightgray',
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}
              >
                <TextInput
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    paddingVertical: 3,
                  }}
                  //value={meetingLocation}
                  onChangeText={(text) => {
                    setEmail(text)
                    setUpdateEmail(text)
                  }}
                  placeholder={`${user.email}`}
                  placeholderTextColor="lightgray"
                />
              </View>
              <TouchableOpacity
                onPress={emailUpdate}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'pink',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  이메일 변경 완료
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setEmailModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Age Modal */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={ageModal}
        onTouchOutside={() => {
          setAgeModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: 300,
              height: 400,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                새로운 나이를 입력하세요.
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 25,
                  padding: 5,
                  borderColor: 'lightgray',
                  marginTop: 20,
                  paddingHorizontal: 20,
                }}
              >
                <TextInput
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    paddingVertical: 3,
                  }}
                  //value={meetingLocation}
                  onChangeText={(text) => {
                    setAge(text)
                    setUpdateAge(text)
                  }}
                  placeholder={`${user.age}`}
                  placeholderTextColor="lightgray"
                />
              </View>
              <TouchableOpacity
                onPress={ageUpdate}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'pink',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  나이 변경 완료
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setAgeModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* region Modal */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={regionModal}
        onTouchOutside={() => {
          setRegionModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: 300,
              height: 400,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                새로운 지역을 누르세요.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  gap: 5,
                  flexWrap: 'wrap',
                }}
              >
                {regionData.map((r, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      borderColor: '#581845',
                      borderWidth: 1,
                      paddingHorizontal: 3,
                      paddingVertical: 7,
                      borderRadius: 30,
                      paddingHorizontal: 5,
                      backgroundColor: region === r.name ? '#581845' : 'white',
                    }}
                    onPress={() => {
                      setRegion(r.name)
                      setUpdateRegion(r.name)
                    }}
                  >
                    <Text
                      style={{
                        color: region === r.name ? 'white' : '#581845',
                        fontSize: 15,
                      }}
                    >
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={regionUpdate}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'pink',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  지역 변경 완료
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setRegionModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* looking for */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={lookingForModal}
        onTouchOutside={() => {
          setLookingForModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: 300,
              height: 400,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                새로운 데이트 목적을 고르세요.
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 20,
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    1. 인생의 동반자를 찾아요.
                  </Text>
                  <Pressable
                    onPress={() => {
                      setLookingFor('인생의 동반자')
                      setUpdateLookginFor('인생의 동반자')
                    }}
                  >
                    <FontAwesome
                      name="circle"
                      size={26}
                      color={
                        lookingFor == '인생의 동반자' ? '#581845' : '#F0F0F0'
                      }
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 20,
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    2. 애인을 만들고 싶어요.
                  </Text>
                  <Pressable
                    onPress={() => {
                      setLookingFor('애인')
                      setUpdateLookginFor('애인')
                    }}
                  >
                    <FontAwesome
                      name="circle"
                      size={26}
                      color={lookingFor == '애인' ? '#581845' : '#F0F0F0'}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 20,
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    3. 썸남/썸녀를 만들고 싶어요.
                  </Text>
                  <Pressable
                    onPress={() => {
                      setLookingFor('썸탈 사람')
                      setUpdateLookginFor('썸탈사람')
                    }}
                  >
                    <FontAwesome
                      name="circle"
                      size={26}
                      color={lookingFor == '썸탈 사람' ? '#581845' : '#F0F0F0'}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 20,
                      fontFamily: 'Se-Hwa',
                    }}
                  >
                    4. 남자사람친구/여자사람친구 찾아요.
                  </Text>
                  <Pressable
                    onPress={() => {
                      setLookingFor('이성친구')
                      setUpdateLookginFor('이성친구')
                    }}
                  >
                    <FontAwesome
                      name="circle"
                      size={26}
                      color={lookingFor == '이성친구' ? '#581845' : '#F0F0F0'}
                    />
                  </Pressable>
                </View>
              </View>

              <TouchableOpacity
                onPress={lookingForUpdate}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'pink',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  데이팅 목적 변경 완료
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setLookingForModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* now status */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={statusModal}
        onTouchOutside={() => {
          setRegionModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: 300,
              height: 400,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                새로운 상태를 누르세요.
              </Text>
              <Text
                style={{ fontFamily: 'Se-Hwa', fontSize: 25, color: 'gray' }}
              >
                커플상태에서는 더이상 추천이 되지 않습니다
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //justifyContent: 'space-between',
                  marginHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: 'Se-Hwa',
                    fontWeight: 500,
                    marginRight: 10,
                  }}
                >
                  솔로
                </Text>
                <Pressable
                  onPress={() => {
                    setStatus('solo')
                    setUpdateStatus('solo')
                  }}
                >
                  <FontAwesome
                    name="circle"
                    size={26}
                    color={status == 'solo' ? '#581845' : '#F0F0F0'}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //justifyContent: 'space-between',
                  marginVertical: 12,
                  marginHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontFamily: 'Se-Hwa',
                    fontWeight: '500',
                    marginRight: 10,
                  }}
                >
                  커플
                </Text>
                <Pressable
                  onPress={() => {
                    setStatus('couple')
                    setUpdateStatus('couple')
                  }}
                >
                  <FontAwesome
                    name="circle"
                    size={26}
                    color={status == 'couple' ? '#581845' : '#F0F0F0'}
                  />
                </Pressable>
              </View>
              <TouchableOpacity
                onPress={statusUpdate}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'pink',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  상태 변경 완료
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setStatusModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* prompt  */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={promptModal}
        onTouchOutside={() => {
          setPromptModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: width * 0.9,
              height: height * 0.8,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <ScrollView>
              <View>
                <View style={{ marginTop: 1, marginHorizontal: 1 }}>
                  {prompts
                    ? prompts?.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            setPromptModal(false)
                            setQuestionModal(true)
                            setQuestionItem(item)
                            setQuestionRe(item.question)
                            setQuestionId(item._id)
                          }}
                          style={{
                            marginVertical: 2,
                            borderWidth: 2,
                            borderColor: 'gray',
                            borderRadius: 15,
                          }}
                          key={index}
                        >
                          <Text
                            style={{
                              fontSize: 17,
                              fontFamily: 'Se-Hwa',
                              padding: 2,
                              color: 'gray',
                            }}
                          >
                            {item.question}
                          </Text>
                          <Text
                            style={{
                              fontSize: 17,
                              marginLeft: 30,
                              color: 'red',
                              fontWeight: '500',
                              fontFamily: 'Se-Hwa',
                              marginBottom: 5,
                            }}
                          >
                            {item.answer}
                          </Text>
                        </TouchableOpacity>
                      ))
                    : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setPromptModal(false)}
                style={{
                  borderRadius: 25,
                  paddingVertical: 5,
                  backgroundColor: 'gray',
                  marginTop: 20,
                  marginHorizontal: 2,
                  paddingHorizontal: 20,
                  width: 200,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Se-Hwa',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 25,
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        contentContainerStyle={{ marginBottom: 30, position: 'absolute' }}
        visible={questionModal}
        onTouchOutside={() => {
          setQuestionModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 20,
              width: width * 0.8,
              height: height * 0.3,
              padding: 15,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.55,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: 'gray',
                fontFamily: 'Se-Hwa',
              }}
            >
              {questionRe}
            </Text>
            <View
              style={{
                padding: 5,
                borderBottomColor: 'gray',
                marginTop: 30,
                borderBottomWidth: 1,
                width: 200,
              }}
            >
              <TextInput
                onChangeText={(text) => setUpdateAnnswer(text)}
                placeholder="답을 입력하시오...."
                multiline={true}
              />
            </View>

            <TouchableOpacity
              style={{
                display: 'flex',

                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 5,
                // borderTopColor: 'gray',
                // borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={promptUpdate}
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 25,
                  color: 'blue',
                  marginTop: 15,
                  padding: 10,
                  backgroundColor: 'gray',
                  width: 200,
                  marginBottom: 50,
                }}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  질문완료
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* image change */}
      <Modal
        contentContainerStyle={{ marginBottom: 30 }}
        visible={imageModal}
        onTouchOutside={() => {
          setImageModal(false)
        }}
        animationType="fade"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 10,
              borderRadius: 20,
              width: width * 0.9,
              height: height * 0.9,
              padding: 5,
              alignItems: 'center',
              shadowColor: 'white',
              shadowOffset: {
                width: 3,
                height: 6,
              },
              shadowOpacity: 0.6,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View style={{ width: '90%' }}>
              <Text style={{ fontFamily: 'Se-Hwa', fontSize: 30 }}>
                Image 변경하기
              </Text>
              <Text
                style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'gray' }}
              >
                이미지는 6장까지 가능합니다.
              </Text>
              <ScrollView style={{ marginTop: 5 }}>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    {images.slice(0, 3).map((url, index) => (
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
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                              }}
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
                </View>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {images.slice(3, 6).map((url, index) => (
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
                              style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                              }}
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
                </View>
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 25,
                    justifyContent: 'center',
                    marginTop: 5,
                    backgroundColor: 'gray',
                    paddingVertical: 5,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 25,
                    }}
                  >
                    이미지 추가하기
                  </Text>
                </TouchableOpacity>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {pickImages &&
                      pickImages.slice(0, 3).map((url, index) => (
                        <Pressable
                          onPress={() => deletePick(url)}
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
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
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
                </View>
                <View style={{ marginTop: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: 20,
                    }}
                  >
                    {pickImages &&
                      pickImages.slice(3, 6).map((url, index) => (
                        <Pressable
                          onPress={() => deletePick(url)}
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
                                style={{
                                  position: 'absolute',
                                  top: 10,
                                  right: 10,
                                }}
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
                </View>
                {pickImages.length > 0 ? (
                  <TouchableOpacity onPress={sendImages}>
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
                      <AntDesign name="picture" size={30} color="red" />
                      <Text
                        style={{
                          color: 'red',
                          textAlign: 'center',
                          fontSize: 25,
                          fontFamily: 'Se-Hwa',
                          marginBottom: 8,
                        }}
                      >
                        사진을 업로드 하기
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <Text>이미지 추가하기를 눌러 주세요</Text>
                  </View>
                )}
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
                {uploadImageButton && (
                  <View>
                    <Text>이미지 업데이트 완료하기를 꼭 눌러주세요.</Text>
                    <TouchableOpacity
                      style={{
                        marginVertical: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        backgroundColor: 'pink',
                        justifyContent: 'space-around',
                        borderRadius: 25,
                      }}
                      onPress={imageUrlsUpdate}
                    >
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 30,
                          fontFamily: 'Se-Hwa',
                          marginBottom: 8,
                        }}
                      >
                        이미지 업데이트 완료하기
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
              <View>
                <TouchableOpacity
                  onPress={() => setImageModal(false)}
                  style={{
                    borderRadius: 25,
                    paddingVertical: 5,
                    backgroundColor: 'gray',
                    marginTop: 20,
                    marginHorizontal: 2,
                    paddingHorizontal: 20,
                    width: 200,
                    marginBottom: 30,
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Se-Hwa',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 25,
                    }}
                  >
                    닫기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  card: {
    width: 400,
    // height: tinderCardWidth * 1.67,
    aspectRatio: 1 / 1.67,
    borderRadius: 15,
    justifyContent: 'flex-end',
    position: 'absolute',

    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  image: {
    borderRadius: 15,
  },
  overlay: {
    top: '10%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  footer: {
    padding: 10,
  },
  name: {
    fontSize: 24,
    color: 'white',
    //fontFamily: 'InterBold',
  },
})
