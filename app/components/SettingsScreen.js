/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Button,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Paho from 'paho-mqtt';

const SettingsScreen = props => {
  const [temp, setTemp] = useState('15,30');
  const [hum, setHum] = useState('-999,999');
  const [email, setEmail] = useState('duongchanviet@gmail.com');

  const handlePress = () => {
    if (!props.client.isConnected()) {
      Alert.alert('Not connected to server!');
      return;
    }

    const [humLower, humUpper, tempLower, tempUpper, _email] = [
      ...hum.split(','),
      ...temp.split(','),
      email,
    ].map((value, index) => {
      const message = new Paho.Message(value.toString());
      message.destinationName = [
        'settings/humidity_lower',
        'settings/humidity_upper',
        'settings/temperature_lower',
        'settings/temperature_upper',
        'settings/email',
      ][index];
      return message;
    });

    [humLower, humUpper, tempLower, tempUpper, _email].forEach(message =>
      props.client.send(message),
    );

    Alert.alert('Settings changed');
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
      <View style={styles.settings}>
        <Text style={styles.title}>Temperature:</Text>
        <View style={styles.card}>
          <Picker
            style={{color: 'black'}}
            selectedValue={temp}
            onValueChange={(itemValue, itemIndex) => setTemp(itemValue)}>
            <Picker.Item
              label="Ambient conditions (15°C - 30°C)"
              value="15,30"
            />
            <Picker.Item label="Room temperature (15°C - 25°C)" value="15,25" />
            <Picker.Item label="Cold or cool place (8°C - 15°C)" value="8,15" />
            <Picker.Item label="Refrigerator (5°C ± 3°C)" value="2,8" />
            <Picker.Item label="Freezer (-20°C ± 5 °C)" value="-25,-15" />
            <Picker.Item label="Deep freezer (< -15°C)" value="-999,-15" />
          </Picker>
        </View>
        <Text style={styles.title}>Humidity:</Text>
        <View style={styles.card}>
          <Picker
            style={{color: 'black'}}
            selectedValue={hum}
            onValueChange={itemValue => setHum(itemValue)}>
            <Picker.Item label="Dry place (< 60%)" value="0,60" />
            <Picker.Item label="No condition" value="-999,999" />
          </Picker>
        </View>
        <Text style={styles.title}>Email:</Text>
        <TextInput
          style={[styles.card, {paddingLeft: 16}]}
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={{width: 100}}>
        <Button title="Submit" onPress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  settings: {
    width: Dimensions.get('window').width > 300 ? 300 : '100%',
  },
  title: {
    fontSize: 28,
    color: 'black',
  },
  card: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    height: 60,
    color: 'black',
  },
});

export default SettingsScreen;
