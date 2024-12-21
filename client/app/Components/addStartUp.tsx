import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/supabaseClient';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

interface TeamMember {
  image: string | null;
  name: string;
  role: string;
  profileLink: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  time: string;
}

const CreateStartup: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [mission, setMission] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddTeamMember = () => {
    setTeam((prev) => [
      ...prev,
      { image: null, name: '', role: '', profileLink: '' },
    ]);
  };

  const handleAddJob = () => {
    setJobs((prev) => [
      ...prev,
      { id: `job${prev.length + 1}`, title: '', company: '', time: '' },
    ]);
  };

  const handlePickImage = async (onUploadCallback: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onUploadCallback(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string, type: 'startups') => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fileName = `${type}/${Date.now()}.jpg`;
      const contentType = 'image/jpeg';

      const { data, error } = await supabase.storage
        .from(type)
        .upload(fileName, decode(base64), { contentType });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage.from(type).getPublicUrl(fileName);

      return publicUrlData?.publicUrl || uri;
    } catch (error) {
      console.error('Error uploading image:', error);
      return uri;
    }
  };

  const uploadImagesAndSaveStartup = async () => {
    try {
      setLoading(true);

      const uploadedLogo =
        logo && !logo.startsWith('https://') ? await uploadImage(logo, 'startups') : logo;
      const uploadedBackdrop =
        backdrop && !backdrop.startsWith('https://')
          ? await uploadImage(backdrop, 'startups')
          : backdrop;

      const uploadedTeam = await Promise.all(
        team.map(async (member) => ({
          ...member,
          image:
            member.image && !member.image.startsWith('https://')
              ? await uploadImage(member.image, 'startups')
              : member.image,
        }))
      );

      const { error } = await supabase.from('startups').insert([
        {
          name,
          description,
          logo: uploadedLogo,
          backdrop: uploadedBackdrop,
          location,
          mission,
          team: uploadedTeam,
          jobs,
        },
      ]);

      if (error) throw error;

      console.log('Startup created successfully!');
    } catch (error) {
      console.error('Error creating startup:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Startup</Text>

      {/* Logo */}
      <View style={styles.section}>
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => handlePickImage((uri) => setLogo(uri))}
        >
          {logo ? (
            <Image source={{ uri: logo }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Pick a Logo</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Backdrop */}
      <View style={styles.section}>
        <Text style={styles.label}>Backdrop</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => handlePickImage((uri) => setBackdrop(uri))}
        >
          {backdrop ? (
            <Image source={{ uri: backdrop }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Pick a Backdrop</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Startup Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter the name"
        />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter the description"
          multiline
        />
      </View>

      {/* Jobs */}
      <View style={styles.section}>
        <Text style={styles.label}>Jobs</Text>
        {jobs.map((job, index) => (
          <View key={job.id} style={styles.projectContainer}>
            <TextInput
              style={styles.input}
              value={job.title}
              onChangeText={(text) => {
                const updatedJobs = [...jobs];
                updatedJobs[index].title = text;
                setJobs(updatedJobs);
              }}
              placeholder="Job Title"
            />
            <TextInput
              style={styles.input}
              value={job.company}
              onChangeText={(text) => {
                const updatedJobs = [...jobs];
                updatedJobs[index].company = text;
                setJobs(updatedJobs);
              }}
              placeholder="Company Name"
            />
            <TextInput
              style={styles.input}
              value={job.time}
              onChangeText={(text) => {
                const updatedJobs = [...jobs];
                updatedJobs[index].time = text;
                setJobs(updatedJobs);
              }}
              placeholder="Job Type (e.g., Full-Time)"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddJob}>
          <Text style={styles.addButtonText}>Add Job</Text>
        </TouchableOpacity>
      </View>

      {/* Team */}
      <View style={styles.section}>
        <Text style={styles.label}>Team</Text>
        {team.map((member, index) => (
          <View key={index} style={styles.projectContainer}>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={() =>
                handlePickImage((uri) => {
                  const updatedTeam = [...team];
                  updatedTeam[index].image = uri;
                  setTeam(updatedTeam);
                })
              }
            >
              {member.image ? (
                <Image source={{ uri: member.image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePickerText}>Pick Team Member Image</Text>
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={member.name}
              onChangeText={(text) => {
                const updatedTeam = [...team];
                updatedTeam[index].name = text;
                setTeam(updatedTeam);
              }}
              placeholder="Team Member Name"
            />
            <TextInput
              style={styles.input}
              value={member.role}
              onChangeText={(text) => {
                const updatedTeam = [...team];
                updatedTeam[index].role = text;
                setTeam(updatedTeam);
              }}
              placeholder="Team Member Role"
            />
            <TextInput
              style={styles.input}
              value={member.profileLink}
              onChangeText={(text) => {
                const updatedTeam = [...team];
                updatedTeam[index].profileLink = text;
                setTeam(updatedTeam);
              }}
              placeholder="Profile Link"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleAddTeamMember}>
          <Text style={styles.addButtonText}>Add Team Member</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={uploadImagesAndSaveStartup}>
        <Text style={styles.saveButtonText}>Save Startup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, fontSize: 16 },
  textArea: { height: 100 },
  imagePicker: { width: 200, height: 200, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  imagePickerText: { color: '#007bff', fontSize: 16 },
  image: { width: 200, height: 200, resizeMode: 'contain' },
  projectContainer: { marginBottom: 16 },
  addButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 4, marginTop: 16 },
  addButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  saveButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 4, marginTop: 24 },
  saveButtonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});

export default CreateStartup;
