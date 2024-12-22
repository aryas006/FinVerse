import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "@/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import BottomNav from "../Components/BottomNav";

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataList, setDataList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  const navigation = useNavigation();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("username, user_id, role, profile_image");

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          return;
        }

        // Fetch from startups
        const { data: startupsData, error: startupsError } = await supabase
          .from("startups")
          .select("name, id, logo, admin");

        if (startupsError) {
          console.error("Error fetching startups:", startupsError);
          return;
        }

        // Fetch from events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("event_name, id, eve_image");

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
          return;
        }

        // Combine data
        const combinedData = [
          ...profilesData.map((profile) => ({
            name: profile.username,
            id: profile.user_id,
            type: "profile",
            image: profile.profile_image || "https://via.placeholder.com/100",
            additionalInfo: profile.role || "N/A",
          })),
          ...startupsData.map((startup) => ({
            name: startup.name,
            id: startup.id,
            type: "startup",
            image: startup.logo || "https://via.placeholder.com/100",
            additionalInfo: `Admin: ${startup.admin}`,
          })),
          ...eventsData.map((event) => ({
            name: event.event_name,
            id: event.id,
            type: "event",
            image: event.eve_image || "https://via.placeholder.com/100",
            additionalInfo: "Event",
          })),
        ];

        setDataList(combinedData);
        setFilteredList(combinedData); // Default to showing all
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchData();
  }, []);

  // Filter the list based on the search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredList(dataList); // Show all if search term is empty
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = dataList.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredList(filtered);
    }
  }, [searchTerm, dataList]);

  // Handle click on a result item
  const handleRedirect = (item: any) => {
    if (item.type === "startup") {
      router.push(`/business/${item.id}`);
    } else if (item.type === "profile") {
      router.push(`/profile/${item.id}`);
    } else if (item.type === "event") {
      router.push(`/events/${item.id}`);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <FlatList
          data={filteredList}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleRedirect(item)}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.resultImage}
              />
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>{item.name}</Text>
                <Text style={styles.additionalInfo}>{item.additionalInfo}</Text>
                <Text style={styles.resultType}>({item.type})</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No results found.</Text>
          }
        />
      </View>
      <BottomNav />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    marginTop: 52,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  resultTextContainer: {
    flex: 1,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  additionalInfo: {
    fontSize: 14,
    color: "#666",
  },
  resultType: {
    fontSize: 12,
    color: "#999",
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});

export default SearchPage;
