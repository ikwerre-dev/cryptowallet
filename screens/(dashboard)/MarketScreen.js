import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TradingViewWidget = () => {
  const url = 'https://www.tradingview.com/widgetembed/?frameElementId=tradingview_12345&symbol=NASDAQ%3AAAPL&interval=1D&theme=dark';

  useEffect(() => {
    console.log('TradingView widget component mounted');
    
    // You can perform any additional setup or fetch data if needed here
    // For example, if you need to change the symbol dynamically, you could fetch data or update the URL

    return () => {
      console.log('TradingView widget component unmounted');
    };
  }, []); // Empty array ensures this effect only runs on mount and unmount

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onError={() => console.log('Failed to load widget')}
        onLoad={() => console.log('Widget loaded')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingTop: 60

  },
  webview: {
    flex: 1,
    // backgroundColor: 'black',
    borderWidth: 0
  },
});

export default TradingViewWidget;
