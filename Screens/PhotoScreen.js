import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useNavigation } from '@react-navigation/native'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { AuthContext } from '../context/AuthContext'
import { AntDesign } from '@expo/vector-icons'

const PhotoScreen = () => {
  const navigation = useNavigation()
  const [pickImages, setPickImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [photoLength, setPhotoLength] = useState()

  const handleAddImage = () => {
    // Find the first empty slot in the array
    const index = imageUrls.findIndex((url) => url === '')

    if (index !== -1) {
      const updatedUrls = [...imageUrls]
      updatedUrls[index] = imageUrl
      setImageUrls(updatedUrls)
      setImageUrl('')
    }
  }

  useEffect(() => {
    // Fetch the saved image URLs from AsyncStorage
    getRegistrationProgress('Photos').then((progressData) => {
      if (progressData && progressData.imageUrls) {
        setImageUrls('')
        // setImageUrls(progressData.imageUrls)
      }
    })
  }, [])

  const handleNext = () => {
    saveRegistrationProgress('Photos', { imageUrls })

    // Navigate to the next screen
    navigation.navigate('Prompts') // Navigate to the appropriate screen
  }

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
    if (pickImages.length < 7) {
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
    } else {
      Alert.alert('실패', '사진은 여섯장까지 올릴 수 있습니다.')
    }
  }

  useEffect(() => {
    console.log('imageUrls', imageUrls)
  }, [imageUrls])

  const deletePicture = (url) => {
    console.log(url)
    setPickImages(pickImages.filter((i) => i !== url))
  }

  return (
    <SafeAreaView>
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="photo-camera-back" size={22} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 30,
              // fontWeight: 'bold',
              fontFamily: 'Se-Hwa',
              marginTop: 15,
            }}
          >
            당신의 사진을 골라주세요!!
          </Text>
          <Text style={{marginTop:10}}>1장~6장까지 업로드할 수 있습니다.</Text>
          <View
            style={{
              marginTop: 1,
              borderWidth: 1,
              borderColor: 'red',
              borderRadius: 25,
              paddingVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: 'red',
            }}
          >
            <Text
              style={{
                fontFamily: 'Se-Hwa',
                color: 'white',
                textDecorationLine: 'underline',
                fontSize: 23,
              }}
            >
              뒷모습, 얼굴가린 모습, 풍경사진, 반려견 사진 모두 가능하니 꼭!!
              1장 이상의 사진을 업로드 해 주세요!!
            </Text>
          </View>
        </TouchableOpacity>

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
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                      <AntDesign name="closecircleo" size={24} color="white" />
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
            {pickImages.slice(3, 6).map((url, index) => (
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
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                      <AntDesign name="closecircleo" size={24} color="white" />
                    </View>
                  </>
                ) : (
                  <EvilIcons name="image" size={22} color="black" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={pickImage}>
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
            <AntDesign name="picture" size={30} color="black" />
            <Text
              style={{
                color: 'gray',
                textAlign: 'center',
                fontSize: 25,
                fontFamily: 'Se-Hwa',
                marginBottom: 8,
              }}
            >
              사진 선택하기
            </Text>
          </View>
        </TouchableOpacity>
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
        ) : null}

        {imageUrls.length > 0 && (
          <TouchableOpacity
            //   onPress={() => navigation.navigate('Prompts')}
            onPress={handleNext}
            activeOpacity={0.8}
            style={{ marginTop: 1, marginLeft: 'auto' }}
          >
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={60}
              color="#581845"
              style={{ alignSelf: 'center', marginTop: 20 }}
            />
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
          <Text style={{ fontFamily: 'Se-Hwa', color: 'white', fontSize: 50 }}>
            다소 시간이 걸릴 수 있습니다.
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default PhotoScreen

const styles = StyleSheet.create({})
