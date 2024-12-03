import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const SupportScreen = () => {
  const url = 'https://widget-page.smartsupp.com/widget/4ea443762778e12250e04350a82ddf11cc1c79b9';

  useEffect(() => {
    console.log('Support widget component mounted');
     
    return () => {
      console.log('Support widget component unmounted');
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
    flex: 1,
   },
  webview: {
    flex: 1,
  },
});

export default SupportScreen;
