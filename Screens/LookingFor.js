import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'

const LookingFor = () => {
  const [lookingFor, setLookingFor] = useState([])
  const navigation = useNavigation()
  useEffect(() => {
    getRegistrationProgress('LookingFor').then((progressData) => {
      if (progressData) {
        setLookingFor(progressData.lookingFor || '')
      }
    })
  }, [])

  const handleNext = () => {
    if (lookingFor.trim() !== '') {
      // Save the current progress data including the name
      saveRegistrationProgress('LookingFor', { lookingFor })
    }
    // Navigate to the next screen
    navigation.navigate('Photos')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginTop: 90, marginHorizontal: 20 }}>
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
            <AntDesign name="hearto" size={22} color="black" />
          </View>
          <Image
            style={{ width: 100, height: 40 }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 30,
            fontFamily: 'Se-Hwa',
            //fontWeight: 'bold',
            //: 'GeezaPro-Bold',
            marginTop: 15,
          }}
        >
          당신이 원하는 데이팅 앱 사용 목적을 골라주세요!!
        </Text>

        <View style={{ marginTop: 30, flexDirection: 'column', gap: 12 }}>
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
                fontSize: 25,
                fontFamily: 'Se-Hwa',
              }}
            >
              1. 인생의 동반자를 찾아요.
            </Text>
            <Pressable onPress={() => setLookingFor('인생의 동반자')}>
              <FontAwesome
                name="circle"
                size={26}
                color={lookingFor == '인생의 동반자' ? '#581845' : '#F0F0F0'}
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
                fontSize: 25,
                fontFamily: 'Se-Hwa',
              }}
            >
              2. 애인을 만들고 싶어요.
            </Text>
            <Pressable onPress={() => setLookingFor('애인')}>
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
                fontSize: 25,
                fontFamily: 'Se-Hwa',
              }}
            >
              3. 썸남/썸녀를 만들고 싶어요.
            </Text>
            <Pressable onPress={() => setLookingFor('썸탈 사람')}>
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
                fontSize: 25,
                fontFamily: 'Se-Hwa',
              }}
            >
              4. 남자사람친구/여자사람친구 찾아요.
            </Text>
            <Pressable onPress={() => setLookingFor('이성친구')}>
              <FontAwesome
                name="circle"
                size={26}
                color={lookingFor == '이성친구' ? '#581845' : '#F0F0F0'}
              />
            </Pressable>
          </View>
        </View>

        {lookingFor && (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            style={{ marginTop: 30, marginLeft: 'auto' }}
          >
            <MaterialCommunityIcons
              name="arrow-right-circle"
              size={45}
              color="#581845"
              style={{ alignSelf: 'center', marginTop: 20 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

export default LookingFor

const styles = StyleSheet.create({})
