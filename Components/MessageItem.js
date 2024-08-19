import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function MessageItem({ item, sender }) {
  //   const route = useRoute()
  //   const { item, sender } = route.params
  //   console.log('item', item)

  const { userId } = useContext(AuthContext)
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: item.sender === sender ? 'flex-end' : 'flex-start',
        padding: 10,
      }}
    >
      <View
        style={{
          backgroundColor: item.sender === sender ? '#dcf8c6' : '#ffffff',
          padding: 10,
          borderRadius: 10,
          maxWidth: '80%',
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <Text className="text-gray-500 text-sm">{item.sender}</Text>
        <Text className="text-gray-900 text-base">{item.message}</Text>
      </View>
    </View>
  )
}
