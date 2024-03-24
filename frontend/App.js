// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import MapViewDirections from "react-native-maps-directions";
// import { Ionicons } from '@expo/vector-icons';

// // MicButton Component
// const MicButton = () => {
//   return (
//     <TouchableOpacity style={styles.micButton}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
//         <Ionicons name="md-mic" size={24} color="white" />
//         <Text style={{ color: 'white', marginLeft: 10 }}>Press to Speak</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// // App Component
// export default function App() {
//   const [origin, setOrigin] = useState(null);
//   const [destination, setDestination] = useState(null);
//   const [region, setRegion] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});

//       const postData = async () => {
//         try {
//           let response = await fetch('http://127.0.0.1:5000/endpoint', {
//             method: 'POST', // Specify the method
//             headers: {
//               'Content-Type': 'application/json',
//               // Any other headers you need to include (e.g., Authorization)
//             },
//             body: JSON.stringify({
//               latitude: location.coords.latitude,//g Your data goes here
//               longitude: location.coords.longitude
//             })
//           });
//           let json = await response.json(); // Assuming the server responds with JSON
//           console.log(json); // Handle the response data
//         } catch (error) {
//           console.error(error); // Handle any errors
//         }
//       };

//       postData();

//       setOrigin({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//       setRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     setDestination({
//       latitude: 37.78825,
//       longitude: -122.4324,
//     });
//   }, []);

//   return (
//     <View style={styles.container}>
//       {region && (
//         <MapViewf
//           style={styles.map}
//           initialRegion={region}
//           provider="google"
//         >
//           {origin && (
//             <Marker coordinate={origin} title="Origin" pinColor="green" />
//           )}
//           {destination && (
//             <Marker
//               coordinate={destination}
//               title="Destination"
//               pinColor="red"
//             />
//           )}
//           {origin && destination && (
//             <MapViewDirections
//               origin={origin}
//               destination={destination}
//               apikey={"AIzaSyDPnSEsUJnIh6J8IdTLNC1MfnWrjBB8IzY"}
//               strokeWidth={3}
//               strokeColor="hotpink"
//             />
//           )}
//         </MapView>
//       )}
//       <MicButton />
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//     marginBottom: 180,
//   },
//   micButton: {
//     backgroundColor: 'black',
//     padding: 10,
//     borderRadius: 1000,
//     position: 'absolute', // Position mic button absolutely over the map
//     bottom: 20, // Distance from bottom
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
// });

// import React, { useEffect } from 'react';
// import { PermissionsIOS } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';

// const App = () => {
//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         const granted = await PermissionsIOS.requestPermission(
//           PermissionsIOS.PERMISSIONS.LOCATION_WHEN_IN_USE,
//         );
//         if (granted === 'granted') {
//           Geolocation.getCurrentPosition(
//             async position => {
//               const { latitude, longitude } = position.coords;
//               // Send latitude and longitude to Flask backend
//               await sendLocationToBackend(latitude, longitude);
//             },
//             error => console.log(error.message),
//             { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
//           );
//         } else {
//           console.log('Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     };

//     getLocation();
//   }, []);

//   const sendLocationToBackend = async (latitude, longitude) => {
//     try {
//       const response = await fetch('/start', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ latitude, longitude }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send location data to backend');
//       }

//       console.log('Location sent to backend successfully');
//     } catch (error) {
//       console.error('Error sending location to backend:', error);
//     }
//   };

//   return null; // or your UI components
// };

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { getDistance } from 'geolib';

class NavigationComponent extends Component {
  state = {
    directions: [], // Array of directions from the backend
    currentWaypointIndex: 0, // Index of the current direction in the directions array
    errorMessage: '',
  };

  componentDidMount() {
    this.requestPermissions();
    this.fetchDirections();
  }

  componentWillUnmount() {
    if (this.watchId) {
      Location.stopLocationUpdatesAsync(this.watchId);
    }
  }

  requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMessage: 'Permission to access location was denied' });
      return;
    }

    this.watchId = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      this.updateNavigationInstructions,
    );
  };

  fetchDirections = async () => {
    // Replace 'http://yourbackend.com/api/directions' with your actual endpoint
    try {
      let response = await fetch('http://yourbackend.com/api/directions');
      let directions = await response.json();
      this.setState({ directions });
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: 'Failed to fetch directions' });
    }
  };

  updateNavigationInstructions = ({ coords }) => {
    const { latitude, longitude } = coords;
    const nextWaypoint = this.getNextWaypoint();
    if (!nextWaypoint) {
      console.log('Reached final destination or no directions provided');
      return;
    }
    const distanceToNextTurn = getDistance(
      { latitude, longitude },
      { latitude: nextWaypoint.latitude, longitude: nextWaypoint.longitude },
    );

    console.log(`Distance to next turn: ${distanceToNextTurn} meters`);

    this.provideAudibleInstructions(distanceToNextTurn, nextWaypoint.instruction);
  };

  getNextWaypoint = () => {
    const { directions, currentWaypointIndex } = this.state;
    if (currentWaypointIndex < directions.length) {
      return directions[currentWaypointIndex];
    }
    return null; // Reached the end of the directions
  };

  provideAudibleInstructions = (distance, instruction) => {
    if (distance < 50) { // Closer than 50 meters to the next waypoint
      Speech.speak(instruction);
      this.setState(prevState => ({ currentWaypointIndex: prevState.currentWaypointIndex + 1 }));
    }
  };

  render() {
    const { errorMessage } = this.state;
    return (
      <View style={styles.container}>
        {errorMessage ? <Text>{errorMessage}</Text> : <Text>Navigation is running...</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavigationComponent;
