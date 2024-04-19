import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



export default function App() {

  // Function to get push token
  const getPushToken = async () => {
    const { data: { data } } = await Notifications.getExpoPushTokenAsync();
    console.log("here");
    console.log(data);
  };
  

  //get push token
  useEffect(() => {

    // Function to check and request notification permissions
    async function checkNotificationPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      //if we dont have permsion, ask for it
      if (finalStatus !== 'granted') {
        console.log('ask user');
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      //if still not granted, tell them its required
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permsion Required',
          'Push notiications need the appropriate notifications'
        );
        return;
      }


      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);
    }
    //call it
    console.log('sdf');
    checkNotificationPermissions();

  }, []);


  // used to act on information when we RECEIVED the notifcaiton
  useEffect(() => {
    const subscsription1 = Notifications.addNotificationReceivedListener((notification) => {
      console.log("NOTIFICATION RECEIVED");
      console.log(notification);
    });

    //used to act on information when we RESPOND to notification
    const subscsription2 = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('USER CLICKED');
      console.log(response);
    });

    //best practive to remove it
    return () => {
      subscsription1.remove();
      subscsription2.remove();
    };

  }, []);



  // Function to schedule a push notification
  async function schedulePushNotification() {

    getPushToken();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
        sound: 'default', // Use the default notification sound
        attachments: [
          {
            identifier: 'imageAttachment',
            url: 'https://picsum.photos/200/300https://fastly.picsum.photos/id/63/5000/2813.jpg?hmac=HvaeSK6WT-G9bYF_CyB2m1ARQirL8UMnygdU9W6PDvM', // URL of the image to display
            type: 'image',
          },
        ],
      },
      trigger: { seconds: 1 }, // Change trigger time as needed
    });
    console.log('should be sent');

  }








  return (
    <View style={styles.container}>
      <Text>Notification App</Text>
      <StatusBar style="auto" />
      <Button onPress={schedulePushNotification} title="Send Notification" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
