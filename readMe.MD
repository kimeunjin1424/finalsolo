yarn add @react-native-community/geolocation

geolocation은 yarn add 로 install해야 한다.

M9t6N2E7Ij0tW2bP mongodb

</MapView>
</MapView>


<MapView
initialRegion={{
  latitude: 13.0451,
  longitude: 77.6269,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}}
style={{ width: '100%', height: 500, marginTop: 20, borderRadius: 5 }}
>
<Marker
  onDragEnd={(e) => handleMarkerDragEnd(e.nativeEvent.coordinate)}
  draggable
  coordinate={coordinates[1]}
>
  <View
    style={{
      backgroundColor: 'black',
      padding: 12,
      borderRadius: 20,
    }}
  >
    <Text
      style={{
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
      }}
    >
      {location}
    </Text>
  </View>
</Marker>

////
Alert.alert('Alert Title', 'My Alert Msg', [
      {
        text: 'Ask me later',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

const getLastMessage = async (myId, fdId) => {
  const msg = await messageModel
    .findOne({
      $or: [
        {
          $and: [
            {
              senderId: {
                $eq: myId,
              },
            },
            {
              reseverId: {
                $eq: fdId,
              },
            },
          ],
        },
        {
          $and: [
            {
              senderId: {
                $eq: fdId,
              },
            },
            {
              reseverId: {
                $eq: myId,
              },
            },
          ],
        },
      ],
    })
    .sort({
      updatedAt: -1,
    })
  return msg
}

module.exports.getFriends = async (req, res) => {
  const myId = req.myId
  let fnd_msg = []
  try {
    const friendGet = await User.find({
      _id: {
        $ne: myId,
      },
    })
    for (let i = 0; i < friendGet.length; i++) {
      let lmsg = await getLastMessage(myId, friendGet[i].id)
      fnd_msg = [
        ...fnd_msg,
        {
          fndInfo: friendGet[i],
          msgInfo: lmsg,
        },
      ]
    }

    // const filter = friendGet.filter(d=>d.id !== myId );
    res.status(200).json({ success: true, friends: fnd_msg })
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: 'Internal Sever Error',
      },
    })
  }
}