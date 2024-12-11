import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";

const Snackbar = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <Animatable.View
      animation="slideInDown"
      duration={300}
      style={styles.snackbar}
    >
      <Text style={styles.snackbarText}>{message}</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    top: 0, // Position it at the top of the screen
    left: 0,
    right: 0,
    padding: 15,
    paddingTop:60,
    backgroundColor: "#D32F2F",
    borderRadius: 8,
    zIndex: 999,
    elevation: 5,
  },
  snackbarText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Snackbar;
