export const messageBox = ({ item }) => {
  return (
    <View>
      <Pressable
        key={item._id}
        style={[
          item?.senderId?._id === userId || item?.userId === userId
            ? {
                alignSelf: 'flex-end',
                backgroundColor: 'lightgray',
                padding: 8,
                maxWidth: '60%',
                borderRadius: 7,
                margin: 10,
              }
            : {
                alignSelf: 'flex-start',
                backgroundColor: '#452c63',
                padding: 8,
                margin: 10,
                borderRadius: 7,
                maxWidth: '60%',
              },
        ]}
      >
        <Text
          style={{
            fontSize: 15,
            textAlign: 'left',
            color: 'white',
            fontWeight: '500',
          }}
        >
          {item?.message}
        </Text>
        <Text
          style={{
            fontSize: 9,
            textAlign: 'right',
            color: '#F0F0F0',
            marginTop: 5,
          }}
        >
          {item.timeData}
        </Text>
      </Pressable>
    </View>
  )
}
