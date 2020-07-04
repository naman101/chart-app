import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getwh, getww } from './utils/layout';
import useWebSocket from 'react-use-websocket';

const chartConfig = {
  backgroundColor: '#022173',
  backgroundGradientFrom: '#022173',
  backgroundGradientTo: '#1b3fa0',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const randomColor = () =>
  // eslint-disable-next-line no-bitwise
  ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7);

const socketUrl =
  'wss://n6s0n7hs9h.execute-api.us-east-1.amazonaws.com/Staging';

export default function App() {
  const [connectionId, setConnectionId] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const { sendMessage, lastJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      sendMessage('Test');
    },
    shouldReconnect: (closeEvent) => true,
    retryOnError: true,
  });

  useEffect(() => {
    if (lastJsonMessage) {
      handleMessage(lastJsonMessage);
    }
  }, [lastJsonMessage, handleMessage]);

  useEffect(() => {
    if (connectionId) {
      fetch(
        `https://yh22ra04ok.execute-api.us-east-1.amazonaws.com/Staging/?requestType=sendGraph1&ConnectionId=${connectionId}`,
      );
      fetch(
        `https://yh22ra04ok.execute-api.us-east-1.amazonaws.com/Staging/?requestType=sendGraph2&ConnectionId=${connectionId}`,
      );
    }
  }, [connectionId]);

  const handleMessage = useCallback((socketData) => {
    if (socketData.hasOwnProperty('connectionId')) {
      setConnectionId(socketData.connectionId);
    } else if (socketData.hasOwnProperty('graphType')) {
      if (socketData.graphType === 'BarChart') {
        setBarChartData({
          labels: Object.keys(socketData.data),
          datasets: [{ data: Object.values(socketData.data) }],
        });
      } else {
        setPieChartData(
          Object.keys(socketData.data).map((month) => {
            return {
              name: month,
              value: socketData.data[month],
              color: randomColor(),
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            };
          }),
        );
      }
    }
  }, []);

  if (barChartData && pieChartData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.connectionId}>
          Current Connection Id - {connectionId}
        </Text>
        <BarChart
          data={barChartData}
          fromZero={true}
          width={getww(100)}
          height={getwh(35)}
          chartConfig={chartConfig}
          showValuesOnTopOfBars={true}
          style={styles.graphStyle}
        />
        <PieChart
          data={pieChartData}
          width={getww(100)}
          height={getwh(30)}
          chartConfig={chartConfig}
          accessor="value"
          absolute={true}
          style={styles.graphStyle}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingMessage}>Please wait</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphStyle: {
    marginVertical: getwh(4),
    borderRadius: 4,
  },
  connectionId: {
    fontWeight: 'bold',
    letterSpacing: 0.64,
  },
  loadingMessage: {
    fontWeight: 'bold',
    marginTop: getwh(2),
  },
});
