/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-shadow */
import {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './components/HomeScreen';
import StatisticsScreen from './components/StatisticsScreen';
import SettingsScreen from './components/SettingsScreen';

import Paho from 'paho-mqtt';

const client = new Paho.Client(
  '18.136.107.88',
  Number(8000),
  `id_${parseInt(Math.random() * 100, 10)}`,
);

const Tab = createBottomTabNavigator();

export default function App() {
  const [data, setData] = useState({
    dustDensity: 0,
    humidity: 0,
    temperature: 0,
    fanStatus: 'stop',
    time: null,
    MQTTStatus: 'Disconnected',
  });
  const [alerts, setAlerts] = useState({
    highHumidity: '',
    highTemperature: '',
    lowTemperature: '',
  });

  const onSuccess = () => {
    setData(data => ({
      ...data,
      MQTTStatus: 1,
    }));
    client.subscribe('sensors/dust');
    client.subscribe('sensors/humidity');
    client.subscribe('sensors/temperature');
    client.subscribe('alarm/high_humidity');
    client.subscribe('alarm/high_temperature');
    client.subscribe('alarm/low_temperature');
    client.subscribe('status/fan');
    client.onMessageArrived = msg => {
      switch (msg.destinationName) {
        case 'sensors/dust':
          setData(data => ({
            ...data,
            dustDensity: Number(msg.payloadString),
          }));
          break;
        case 'sensors/humidity':
          setData(data => ({
            ...data,
            humidity: Number(msg.payloadString),
          }));
          break;
        case 'sensors/temperature':
          setData(data => ({
            ...data,
            temperature: Number(msg.payloadString),
          }));
          break;
        case 'alarm/high_humidity':
          setAlerts(alerts => ({
            ...alerts,
            highHumidity: 'High Humidity Level!',
          }));
          break;
        case 'alarm/high_temperature':
          setAlerts(alerts => ({
            ...alerts,
            highTemperature: 'High Temperature Level!',
          }));
          break;
        case 'alarm/low_temperature':
          setAlerts(alerts => ({
            ...alerts,
            lowTemperature: 'Low Temperature Level!',
          }));
          break;
        case 'status/fan':
          setData(data => ({
            ...data,
            fanStatus: msg.payloadString,
          }));
          break;
      }

      setData(data => ({
        ...data,
        time: new Date().toString(),
      }));
    };
    client.onConnectionLost = () => {
      setData(data => ({
        ...data,
        MQTTStatus: 0,
      }));
    };
  };

  useEffect(() => {
    if (!client.isConnected()) {
      client.connect({
        onSuccess: onSuccess,
        reconnect: true,
        onFailure: () =>
          setData(data => ({
            ...data,
            MQTTStatus: 0,
          })),
      });
    } else {
      setData(data => ({
        ...data,
        MQTTStatus: 1,
      }));
      onSuccess();
    }
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Statistics') {
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          children={() => {
            return <HomeScreen data={data} client={client} alerts={alerts} />;
          }}
        />
        <Tab.Screen
          name="Statistics"
          children={() => {
            return <StatisticsScreen alerts={alerts} />;
          }}
        />
        <Tab.Screen
          name="Settings"
          children={() => {
            return <SettingsScreen client={client} alerts={alerts} />;
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
