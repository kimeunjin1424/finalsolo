import { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  let promptss = [
    {
      id: 1,
      question: '당신의 직업 및 직장은 무엇인가요(학생/군인/공무원/사업등등)?',
    },
    {
      id: 2,
      question: '당신의 MBTI는 어떻게 되나요?',
    },
    {
      id: 3,
      question: '당신의 키와 몸무게는 어떻게 되나요?',
    },
    {
      id: 4,
      question: '당신은 장점은 무엇인가요?',
    },
    {
      id: 5,
      question: '당신의 인생의 목표는 무엇인가요?',
    },
    {
      id: 6,
      question: '당신의 연봉은 어느정도 인가요?',
    },

    {
      id: 7,
      question: '최근에 가장 감명깊게 읽은 책은 무엇인가요?',
    },
    {
      id: 8,
      question: '당신의 이상형은 어떻게 되나요?',
    },
    {
      id: 9,
      question: '당신이 기피하고 싶은 싶은 여성을 말해주세요',
    },
    {
      id: 10,
      question: '당신은 어떤 연얘를 꿈꾸시나요?',
    },
    {
      id: 11,
      question: '당신에게 가장 힐링되는 것은 무엇인가요?',
    },
    {
      id: 12,
      question: '당신의 취미나 특기는 무엇인가요?',
    },
  ]

  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prompts, setPrompts] = useState(promptss)
  const [userId, setUserId] = useState('')
  const [userInfo, setUserInfo] = useState('')
  const [apiUser, setApiUser] = useState([])

  // const login = () => {
  //   setToken('hinge_token')
  //   setIsLoading(false)
  // }

  // const register = () => {
  //   setToken('')
  //   setIsLoading(false)
  // }

  // const isLoggedIn = async () => {
  //   try {
  //     setIsLoading(true)
  //     const userToken = await AsyncStorage.getItem('hinge_token')
  //     setToken(userToken)
  //     setIsLoading(false)
  //     console.log('hingToken', token)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

  // useEffect(() => {
  //   isLoggedIn()
  // }, [])

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = await AsyncStorage.getItem('hinge_token')
  //     console.log('token', token)
  //     setToken(token)
  //     const decodedToken = jwtDecode(token)
  //     const uId = decodedToken.userId
  //     setUserId(uId)
  //     console.log('AuthContext UserId', userId)
  //   }
  //   fetchUser()
  // }, [])

  return (
    <AuthContext.Provider
      value={{
        prompts,
        setPrompts,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
