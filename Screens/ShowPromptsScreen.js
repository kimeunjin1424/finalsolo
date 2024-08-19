import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  useWindowDimensions,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import { SlideAnimation } from 'react-native-modals'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ModalTitle } from 'react-native-modals'
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../Utils/registrationUtils'
import { AuthContext } from '../context/AuthContext'

const ShowPromptsScreen = () => {
  const { width, height } = useWindowDimensions()
  const navigation = useNavigation()

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [filterdQuestion, setFilterdQuestion] = useState([])
  const [questionId, setQuestionId] = useState('')

  const { prompts, setPrompts } = useContext(AuthContext)

  const route = useRoute()

  console.log('prompts', prompts)

  useEffect(() => {
    // Fetch the saved image URLs from AsyncStorage
    getRegistrationProgress('Prompts').then((progressData) => {
      if (progressData) {
        setPrompts(progressData.prompts)
      }
    })
  }, [])

  const handleNext = async () => {
    // Save the current progress data including the image URLs
    await saveRegistrationProgress('Prompts', { prompts })

    // Navigate to the next screen

    navigation.navigate('Prompts') // Navigate to the appropriate screen
  }

  const openModal = (item) => {
    setModalVisible(!isModalVisible)

    setQuestion(item?.question)
  }

  const addPrompt = () => {
    console.log('id', questionId)
    objIndex = prompts.findIndex((obj) => obj.id == questionId)
    prompts[objIndex].answer = answer

    console.log('1111', prompts)

    setQuestion('')
    setAnswer('')
    setQuestionId('')
    setModalVisible(false)
  }

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white', marginTop: 50 }}
      >
        <ScrollView>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: 'red',
                  borderRadius: 25,
                  padding: 5,
                }}
                onPress={handleNext}
              >
                <Text
                  style={{ fontFamily: 'Se-Hwa', fontSize: 20, color: 'red' }}
                >
                  질문완료/돌아가기
                </Text>
              </TouchableOpacity>
            </View>

            <Pressable onPress={() => navigation.goBack()}>
              <Entypo name="cross" size={30} color="black" />
            </Pressable>
          </View>

          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'Se-Hwa', fontSize: 25 }}>
              Answer The Question
            </Text>
          </View>
          <View style={{ marginTop: 20, marginHorizontal: 12 }}>
            {prompts
              ? prompts?.map((item, index) => (
                  <Pressable
                    onPress={() => {
                      openModal(item)
                      setQuestion(item.question)
                      setQuestionId(item.id)
                    }}
                    style={{
                      marginVertical: 12,
                      borderWidth: 2,
                      borderColor: 'gray',
                      borderRadius: 25,
                    }}
                    key={index}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontFamily: 'Se-Hwa',
                        padding: 5,
                        color: 'gray',
                      }}
                    >
                      {item.question}
                    </Text>
                    <Text
                      style={{
                        fontSize: 25,
                        marginLeft: 30,
                        color: 'red',
                        fontWeight: '500',
                        fontFamily: 'Se-Hwa',
                        marginBottom: 5,
                      }}
                    >
                      {item.answer}
                    </Text>
                  </Pressable>
                ))
              : null}
          </View>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              borderWidth: 2,
              borderRadius: 25,
              borderColor: 'red',
              padding: 7,
              marginHorizontal: 20,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 30, fontFamily: 'Se-Hwa', color: 'red' }}>
              질문완료/저장하기
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal
        contentContainerStyle={{ marginBottom: 30, position: 'absolute' }}
        visible={isModalVisible}
        onTouchOutside={() => {
          setModalVisible(false)
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
              height: height * 0.4,
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
              {question}
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
                onChangeText={(text) => setAnswer(text)}
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
                onPress={addPrompt}
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
    </>
  )
}

export default ShowPromptsScreen

const styles = StyleSheet.create({})
