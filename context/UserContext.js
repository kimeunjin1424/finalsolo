import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import 'core-js/stable/atob'
import { AuthContext } from './AuthContext'
import axios from 'axios'
import { baseUrl } from '../Utils/api'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState('')
 

  const { userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        await axios
          .get(`${baseUrl}/api/user/user-profile/${userId}`)
          .then((res) => {
            for (i = 0; i < res.data.user.likedProfiles.length; i++)
              setLikedPeople((prev) => [
                ...prev,
                res.data?.user?.likedProfiles[i]._id,
              ])
            setUserInfo(res.data.user)
            for (i = 0; i < res.data.user.saveProfiles.length; i++)
              setSavePeople((prev) => [
                ...prev,
                res.data?.user?.saveProfiles[i]._id,
              ])
          })
          .catch((err) => console.log('profile Error', err))
      } catch (err) {
        console.log('fetchErr', err)
      }
    }
    if (userId) fetchUserInfo()
  }, [userId])

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        likedPeople,
        setLikedPeople,
        savePeople,
        setSavePeople,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
