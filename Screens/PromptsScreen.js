import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import { AuthContext } from '../context/AuthContext'
import { useIsFocused } from '@react-navigation/native'

const PromptsScreen = () => {
  const route = useRoute()
  const isFocused = useIsFocused()

  const navigation = useNavigation()

  const { prompts, setPrompts } = useContext(AuthContext)

  useEffect(() => {
    // Fetch the saved image URLs from AsyncStorage
    getRegistrationProgress('Prompts').then((progressData) => {
      if (progressData) {
        setPrompts(progressData.prompts)
      }
    })
  }, [isFocused])

  const handleNext = async () => {
    // Save the current progress data including the image URLs
    await saveRegistrationProgress('Prompts', { prompts })

    // Navigate to the next screen

    navigation.navigate('PreFinal') // Navigate to the appropriate screen
  }

  return (
    <ScrollView>
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
            <AntDesign name="eye" size={22} color="black" />
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
          추가 질문에 답하시겠습니까?(선택사항입니다)
        </Text>

        <View style={{ marginTop: 20, flexDirection: 'column', gap: 20 }}>
          {prompts ? (
            prompts.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => navigation.navigate('ShowPrompts')}
                style={{
                  borderColor: '#707070',
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderStyle: 'dashed',
                  borderRadius: 10,
                  height: 100,
                }}
              >
                <Text
                  style={{
                    fontWeight: '600',
                    fontFamily: 'Se-Hwa',
                    fontSize: 25,
                  }}
                >
                  {item?.question}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    fontStyle: 'italic',
                    fontSize: 15,
                    marginTop: 3,
                    color: 'purple',
                  }}
                >
                  {item?.answer}
                </Text>
              </Pressable>
            ))
          ) : (
            <View>
              <Text>Not Prompts</Text>
            </View>
          )}

          <View>
            <Pressable
              onPress={() => {
                navigation.navigate('ShowPrompts')
              }}
              style={{
                //borderColor: '#707070',
                borderColor: 'purple',
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderStyle: 'dashed',
                borderRadius: 10,
                height: 70,
                marginVertical: 2,
              }}
            >
              <Text
                style={{
                  color: 'purple',
                  fontWeight: '600',
                  fontSize: 25,
                  fontFamily: 'Se-Hwa',
                }}
              >
                추가질문에 답하러가기(Click)
              </Text>
            </Pressable>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.8}
          style={{ marginTop: 10, marginLeft: 'auto', marginBottom: 100 }}
        >
          <MaterialCommunityIcons
            name="arrow-right-circle"
            size={55}
            color="#581845"
            style={{ alignSelf: 'center', marginTop: 5 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default PromptsScreen
