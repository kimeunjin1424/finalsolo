import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'
import { AuthContext } from './AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'
import { UserContext } from './UserContext'

const UsersContext = createContext()

const UsersProvider = ({ children }) => {
  const [apiUser, setApiUser] = useState('')

  const { userInfo } = useContext(UserContext)

  useEffect(() => {
    const getApiUsers = async () => {
      try {
        await axios
          .post(`${baseUrl}/api/user/api-users`, {
            userId: userInfo._id,
            gender: userInfo.gender,
            region: userInfo.region,
          })
          .then((res) => {
            setApiUser(res.data.users)
          })
          .catch((err) => {
            console.log('err', err)
          })
      } catch (err) {
        console.log('fetch Users', err)
      }
    }
    if (userInfo) getApiUsers()
  }, [userInfo])

  return (
    <UsersContext.Provider
      value={{
        apiUser,
        setApiUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export { UsersContext, UsersProvider }
