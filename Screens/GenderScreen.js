import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
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

const GenderScreen = () => {
  const [gender, setGender] = useState('')
  const navigation = useNavigation()
  useEffect(() => {
    getRegistrationProgress('Gender').then((progressData) => {
      if (progressData) {
        setGender(progressData.gender || '')
      }
    })
  }, [])

  const handleNext = () => {
    if (gender.trim() !== '') {
      // Save the current progress data including the name
      saveRegistrationProgress('Gender', { gender })
    }
    // Navigate to the next screen
    navigation.navigate('LookingFor')
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
            <MaterialCommunityIcons
              name="cake-variant-outline"
              size={26}
              color="black"
            />
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
            marginTop: 15,
          }}
        >
          당신의 성별을 선택해 주세요!
        </Text>

        <Text
          style={{
            marginTop: 30,
            fontFamily: 'Se-Hwa',
            fontSize: 20,
            color: 'gray',
          }}
        >
          남자는 여자 사용자, 여자는 남자 사용자만 볼 수 있습니다
        </Text>

        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: 25,
                fontFamily: 'Se-Hwa',
                fontWeight: 500,
              }}
            >
              남자
            </Text>
            <Pressable onPress={() => setGender('Men')}>
              <FontAwesome
                name="circle"
                size={26}
                color={gender == 'Men' ? '#581845' : '#F0F0F0'}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 12,
            }}
          >
            <Text
              style={{ fontSize: 25, fontFamily: 'Se-Hwa', fontWeight: '500' }}
            >
              여자
            </Text>
            <Pressable onPress={() => setGender('Women')}>
              <FontAwesome
                name="circle"
                size={26}
                color={gender == 'Women' ? '#581845' : '#F0F0F0'}
              />
            </Pressable>
          </View>
        </View>

        {gender && (
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

export default GenderScreen

const styles = StyleSheet.create({})
