import Geolocation from '@react-native-community/geolocation';

function getCurrentLocation() {
  Geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    error => {
      console.log(error.message);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
}
