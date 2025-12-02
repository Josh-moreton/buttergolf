import React from "react";
import { View, Text, Pressable } from "react-native";

export default function MinimalRoot() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fbfbf9",
      }}
    >
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Minimal Root</Text>
      <Pressable
        onPress={() => {}}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: "#13a063",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Tap</Text>
      </Pressable>
    </View>
  );
}
