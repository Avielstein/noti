import React, { useEffect, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



export default function App() {


  // used to act on information when we receive info
  useEffect(()=>{
    const subscsription = Notifications.addNotificationReceivedListener((notification)=>{
      console.log("NOTIFICATION RECEIVED");
      console.log(notification);
    });

    //best practive to remove it
    return ()=>{
      subscsription.remove();
    };
    
  },[]);

  // Function to check and request notification permissions
  async function checkNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === 'granted';
    }
    return true;
  }

  // Function to schedule a push notification
  async function schedulePushNotification() {
    const hasPushNotificationPermissionGranted = await checkNotificationPermissions();

    if (hasPushNotificationPermissionGranted) {
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
    } else {
      console.log('Notification permission denied');
      // Handle notification permission denied scenario
    }
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
