import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const PersonalDetailsScreen = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user && !formData) {
      setFormData({
        email: user.email || "",
        uid: user.uid || "",
        created_date: user.created_date || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    console.log("Saving form data:", formData);
    // Handle save functionality here
  };

  const InputField = ({ icon, value, placeholder, onChangeText }) => (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#666"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        readOnly
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
    </View>
  );

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>

          <InputField
            icon="email"
            value={formData?.email}
            placeholder="Email"
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, email: text }))
            }
          />
          <InputField
            icon="account"
            value={formData?.uid}
            placeholder="User ID"
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, uid: text }))
            }
          />
          <InputField
            icon="calendar"
            value={formData?.created_date}
            placeholder="Creation Date"
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, created_date: text }))
            }
          />
        
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#000000",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PersonalDetailsScreen;
