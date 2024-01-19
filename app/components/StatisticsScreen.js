/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
  Text,
} from 'react-native';
import WebView from 'react-native-webview';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

const screenSize = Dimensions.get('screen');

const StatisticsScreen = props => {
  const [dateStart, setDateStart] = useState(new Date(Date.now() - 86400000));
  const [dateEnd, setDateEnd] = useState(new Date(Date.now()));
  const [filter, setFilter] = useState('');

  const showMode = (date, setDate) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: (event, selectedDate) => {
        setDate(selectedDate);
      },
      mode: date,
      is24Hour: true,
    });
  };

  const showDateStartPicker = () => {
    showMode(dateStart, setDateStart);
  };

  const showDateEndPicker = () => {
    showMode(dateEnd, setDateEnd);
  };

  useEffect(() => {
    for (const alert in props.alerts) {
      if (props.alerts[alert] !== '') {
        Alert.alert(props.alerts[alert]);
        props.alerts[alert] = '';
      }
    }
  }, [props.alerts]);

  useEffect(() => {
    setFilter(
      `{"time":{$gte:ISODate("${dateStart.toISOString()}"),$lt:ISODate("${dateEnd.toISOString()}")}}`,
    );
  }, [dateStart, dateEnd]);

  if (Platform.OS === 'web') {
    return (
      <div>
        <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          }}
          width="100%"
          height="360"
          src={
            'https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fca99f-d57f-456e-8f4c-6ba177f8e814&maxDataAge=3600&theme=light&autoRefresh=true'
          }
        />
        <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          }}
          width="100%"
          height="360"
          src={
            'https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fcab9b-3848-45c3-8bf5-db7a5bd0b069&maxDataAge=3600&theme=light&autoRefresh=true'
          }
        />
        <iframe
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
          }}
          width="100%"
          height="360"
          src={
            'https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fcaadf-e2eb-486b-8425-9f528ed5e5ab&maxDataAge=3600&theme=light&autoRefresh=true'
          }
        />
      </div>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.dateView}>
          <TouchableOpacity onPress={showDateStartPicker}>
            <Text style={{color: 'black'}}>{dateStart.toString()}</Text>
          </TouchableOpacity>
          <Text style={{fontSize: 16, color: 'black'}}>to</Text>
          <TouchableOpacity onPress={showDateEndPicker}>
            <Text style={{color: 'black'}}>{dateEnd.toString()}</Text>
          </TouchableOpacity>
        </View>
        <WebView
          scalesPageToFit={false}
          bounces={false}
          javaScriptEnabled
          style={{width: screenSize.width}}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head></head>
                <body>
                  <div>
                    <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2); margin-bottom: 32px;" width="100%" height="360" src='https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fca99f-d57f-456e-8f4c-6ba177f8e814&maxDataAge=3600&theme=light&filter=${filter}&autoRefresh=true'></iframe>
                    <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2); margin-bottom: 32px;" width="100%" height="360" src='https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fcab9b-3848-45c3-8bf5-db7a5bd0b069&maxDataAge=3600&theme=light&filter=${filter}&autoRefresh=true'></iframe>
                    <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="360" src='https://charts.mongodb.com/charts-project-0-zylsy/embed/charts?id=63fcaadf-e2eb-486b-8425-9f528ed5e5ab&maxDataAge=3600&theme=light&filter=${filter}&autoRefresh=true'></iframe>
                  </div>
                </body>
              </html>
            `,
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateView: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
});

export default StatisticsScreen;
