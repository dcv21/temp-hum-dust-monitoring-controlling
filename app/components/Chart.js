import React, {useEffect, useRef, useState} from 'react';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';
import {WebView} from 'react-native-webview';

const Chart = ({filter, chartId, height, width}) => {
  const sdk = new ChartsEmbedSDK({
    baseUrl: 'https://charts.mongodb.com/charts-project-0-zylsy',
  });
  const chartDiv = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [chart] = useState(
    sdk.createChart({
      chartId: chartId,
      height: height,
      width: width,
      theme: 'dark',
    }),
  );

  useEffect(() => {
    chart
      .render(chartDiv.current)
      .then(() => setRendered(true))
      .catch(err => console.log('Error during Charts rendering.', err));
  }, [chart]);

  useEffect(() => {
    if (rendered) {
      chart
        .setFilter(filter)
        .catch(err => console.log('Error while filtering.', err));
    }
  }, [chart, filter, rendered]);

  return <WebView source={{html: `<div className="chart" ref=${chartDiv}`}} />;
};

export default Chart;
