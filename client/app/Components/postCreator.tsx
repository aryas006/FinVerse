import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Keyboard, Platform, Image, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const CreatePostOrEvent = () => {
  const [content, setContent] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [schedules, setSchedules] = useState<string[]>(['']);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access the gallery is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setExpanded(true);
    }
  };

  const addScheduleBox = () => {
    setSchedules([...schedules, '']);
  };

  const removeScheduleBox = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
  };

  const updateSchedule = (index: number, value: string) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = value;
    setSchedules(updatedSchedules);
  };

  const handleOutsideClick = () => {
    Alert.alert('Discard Upload?', 'Are you sure you want to discard the upload?', [
      {
        text: 'Yes',
        onPress: () => navigation.goBack(),
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleOutsideClick}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalBackground}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={handleOutsideClick}
          activeOpacity={1}
        >
          <View style={[styles.modalContainer, expanded ? styles.expandedContainer : styles.reducedContainer]}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              {!expanded ? (
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.largeButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                    onPress={() => {
                      setIsEvent(false);
                      pickImage();
                    }}
                  >
                    <Text style={[styles.plusSign, { color: 'green' }]}>+</Text>
                    <Text style={styles.iconText}>Add Post</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.largeButton, { backgroundColor: 'rgba(255, 255, 255, 0.5)' }]}
                    onPress={() => {
                      setIsEvent(true);
                      setExpanded(true);
                    }}
                  >
                    <Text style={[styles.plusSign, { color: 'green' }]}>+</Text>
                    <Text style={styles.iconText}>Add Event</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {imageUri && !isEvent && (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: imageUri }} style={styles.largeImagePreview} />
                    </View>
                  )}

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.inputLarge, { height: 170 }]}
                      placeholder={isEvent ? 'Add event description...' : 'Write your post description...'}
                      multiline
                      value={content}
                      onChangeText={setContent}
                    />
                  </View>

                  {isEvent && (
                    <ScrollView
                      contentContainerStyle={{
                        paddingBottom: 20, // Ensures there's enough space at the bottom
                      }}
                      style={{

                        maxHeight: 200, // Fixed height to prevent resizing
                      }}
                      keyboardShouldPersistTaps="handled" // Prevents ScrollView from resetting
                    >
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={styles.datePickerButton}
                      >
                        <Text style={styles.datePickerText}>{
                          eventDate
                            ? `Event Date: ${eventDate.toDateString()} ${eventDate.toLocaleTimeString()}`
                            : 'Select Event Date'
                        }</Text>
                      </TouchableOpacity>

                      {showDatePicker && (
                        <DateTimePicker
                          value={eventDate || new Date()}
                          mode="datetime"
                          display="spinner"
                          textColor="black"
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setEventDate(selectedDate);
                          }}
                        />
                      )}

                      {schedules.map((schedule, index) => (

                        <View key={index} style={styles.scheduleRow}>
                          {/* <Text style={styles.label}>Schedule {index + 1}</Text> */}
                          <TextInput
                            style={styles.inputSchedule}
                            placeholder={`Enter details for Schedule ${index + 1}`}
                            value={schedule}
                            onChangeText={(value) => updateSchedule(index, value)}
                          />
                          <TouchableOpacity
                            style={styles.removeScheduleButton}
                            onPress={() => removeScheduleBox(index)}
                          >
                            <Text style={styles.buttonText}>X</Text>
                          </TouchableOpacity>
                        </View>

                      ))}
                      <TouchableOpacity style={styles.addScheduleButton} onPress={addScheduleBox}>
                        <Text style={[styles.buttonText, { color: 'black' }]}>Add Schedule</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  )}

                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => {
                      Alert.alert('Success', `${isEvent ? 'Event' : 'Post'} created successfully!`);
                      setExpanded(false);
                      setSchedules(['']);
                      setImageUri(null);
                      setEventDate(null);
                    }}
                  >
                    <Text style={styles.buttonText}>{isEvent ? 'Post Event' : 'Post'}</Text>
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  expandedContainer: {
    minHeight: '70%',
  },
  reducedContainer: {
    minHeight: '10%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  largeButton: {
    width: '45%',
    aspectRatio: 1,
  },
  plusSign: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  iconText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  descriptionContainer: {

  },
  inputLarge: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',

  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#E8F0FE',
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  largeImagePreview: {
    width: 180,
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  scheduleRow: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputSchedule: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '80%',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  removeScheduleButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  addScheduleButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 10,
    alignItems: 'center',
  },
  postButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
});

export default CreatePostOrEvent;
