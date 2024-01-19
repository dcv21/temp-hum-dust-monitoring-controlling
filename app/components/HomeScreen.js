/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Paho from 'paho-mqtt';

const DataItem = props => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.title}>{props.label}</Text>
      <Text style={styles.content}>{props.value}</Text>
    </View>
  );
};

const ServerStatus = props => {
  const imgSize = Dimensions.get('window').width * 0.15;
  if (props.MQTTStatus !== 0) {
    return (
      <Image
        style={{height: imgSize, width: imgSize}}
        source={require('../assets/connected.png')}
      />
    );
  }
  return (
    <Image
      style={{height: imgSize, width: imgSize}}
      source={require('../assets/disconnected.png')}
    />
  );
};

function HomeScreen(props) {
  const data = props.data;

  const handlePress = () => {
    if (!props.client.isConnected()) {
      Alert.alert('Not connected to server!');
      return;
    }

    const message = new Paho.Message(data.fanStatus === 'stop' ? '1' : '0');
    message.destinationName = 'actuators/fan';

    props.client.send(message);
  };

  useEffect(() => {
    for (const alert in props.alerts) {
      if (props.alerts[alert] !== '') {
        Alert.alert(props.alerts[alert]);
        props.alerts[alert] = '';
      }
    }
  }, [props.alerts]);

  return (
    <View style={styles.container}>
      <DataItem label="Dust density" value={`${data.dustDensity} µg/m³`} />
      <DataItem label="Temperature" value={`${data.temperature}°C`} />
      <DataItem label="Humidity" value={`${data.humidity}%`} />
      <DataItem label="TDTU" value={0} />
      <View style={{marginVertical: 5, justifyContent: 'center'}}>
        <Text style={{color: 'black'}}>Last updated: {data.time}</Text>
      </View>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
        <Text style={{fontSize: 20, color: 'black'}}>Server Status: </Text>
        <ServerStatus MQTTStatus={data.MQTTStatus} />
      </View>
      <View>
        <Button
          title={`Fan: ${data.fanStatus}`}
          color={data.fanStatus === 'run' ? 'green' : 'red'}
          onPress={handlePress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 300,
    color: 'black',
  },
  content: {
    fontSize: 48,
    fontWeight: 500,
    color: 'black',
  },
});

export default HomeScreen;
