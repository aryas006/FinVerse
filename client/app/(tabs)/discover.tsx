import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BottomNav from '../Components/BottomNav';

interface Event {
  id: string;
  image: string;
  title: string;
  time: string;
  organizer: string;
}

interface Startup {
  id: string;
  image: string;
  name: string;
  description: string;
  creator: string;
}

const events: Event[] = [
  {
    id: '1',
    image: require('../../assets/images/event_icon.png'),
    title: 'Framer Web MasterClass',
    time: 'Today, 2:00 pm',
    organizer: 'Framer',
  },
  {
    id: '2',
    image: require('../../assets/images/event_b.png'),
    title: 'Art Class',
    time: 'Today, 2:00 pm',
    organizer: 'Artist',
  },
  {
    id: '3',
    image: require('../../assets/images/event_icon_b.png'),
    title: 'Web Dev',
    time: 'Today, 2:00 pm',
    organizer: 'Framer',
  },
  {
    id: '4',
    image: require('../../assets/images/event_c.png'),
    title: 'Design Workshop',
    time: 'Today, 4:00 pm',
    organizer: 'Designer',
  },
  {
    id: '5',
    image: require('../../assets/images/event_icon.png'),
    title: 'Startup Pitch',
    time: 'Today, 5:00 pm',
    organizer: 'Entrepreneur',
  },
  {
    id: '6',
    image: require('../../assets/images/event_icon_b.png'),
    title: 'Code Review',
    time: 'Today, 6:00 pm',
    organizer: 'Developer',
  },
];

const startups: Startup[] = [
  {
    id: '1',
    image: require('../../assets/images/st_a.png'),
    name: 'Bayrack',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'Arya',
  },
  {
    id: '2',
    image: require('../../assets/images/st_b.png'),
    name: 'Kite',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'Zerodha',
  },
  {
    id: '3',
    image: require('../../assets/images/event_icon_b.png'),
    name: '1px',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'Arya',
  },
  {
    id: '4',
    image: require('../../assets/images/event_b.png'),
    name: 'RedChillies',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'SRK',
  },
  {
    id: '5',
    image: require('../../assets/images/event_icon_b.png'),
    name: 'MCA',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'Parth',
  },
  {
    id: '6',
    image: require('../../assets/images/st_b.png'),
    name: 'Cwrazy Club',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.',
    creator: 'Praju',
  },
];

const groupEvents = (data: Event[], itemsPerColumn: number) => {
  const columns: Event[][] = [];
  for (let i = 0; i < data.length; i += itemsPerColumn) {
    columns.push(data.slice(i, i + itemsPerColumn));
  }
  return columns;
};

const groupStartups = (data: Startup[], itemsPerColumn: number) => {
  const columns: Startup[][] = [];
  for (let i = 0; i < data.length; i += itemsPerColumn) {
    columns.push(data.slice(i, i + itemsPerColumn));
  }
  return columns;
};

const Discover = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false); // Moved inside the component

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Raleway-Variable': require('../../assets/fonts/Raleway-VariableFont_wght.ttf'),
        'Raleway-Italic-Variable': require('../../assets/fonts/Raleway-Italic-VariableFont_wght.ttf'),
        'Raleway-Black': require('../../assets/fonts/Raleway-Black.ttf'),
        'Raleway-BlackItalic': require('../../assets/fonts/Raleway-BlackItalic.ttf'),
        'Raleway-Bold': require('../../assets/fonts/Raleway-Bold.ttf'),
        'Raleway-BoldItalic': require('../../assets/fonts/Raleway-BoldItalic.ttf'),
        'Raleway-ExtraBold': require('../../assets/fonts/Raleway-ExtraBold.ttf'),
        'Raleway-ExtraBoldItalic': require('../../assets/fonts/Raleway-ExtraBoldItalic.ttf'),
        'Raleway-ExtraLight': require('../../assets/fonts/Raleway-ExtraLight.ttf'),
        'Raleway-ExtraLightItalic': require('../../assets/fonts/Raleway-ExtraLightItalic.ttf'),
        'Raleway-Italic': require('../../assets/fonts/Raleway-Italic.ttf'),
        'Raleway-Light': require('../../assets/fonts/Raleway-Light.ttf'),
        'Raleway-LightItalic': require('../../assets/fonts/Raleway-LightItalic.ttf'),
        'Raleway-Medium': require('../../assets/fonts/Raleway-Medium.ttf'),
        'Raleway-MediumItalic': require('../../assets/fonts/Raleway-MediumItalic.ttf'),
        'Raleway-Regular': require('../../assets/fonts/Raleway-Regular.ttf'),
        'Raleway-SemiBold': require('../../assets/fonts/Raleway-SemiBold.ttf'),
        'Raleway-SemiBoldItalic': require('../../assets/fonts/Raleway-SemiBoldItalic.ttf'),
        'Raleway-Thin': require('../../assets/fonts/Raleway-Thin.ttf'),
        'Raleway-ThinItalic': require('../../assets/fonts/Raleway-ThinItalic.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  const groupedEvents = groupEvents(events, 3);
  const groupedStartUps = groupStartups(startups, 2);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Show a loading screen while fonts are loading
  }

  return (
    <>
    
    <ScrollView style={styles.container}>
        <View style={styles.topNavBar}>
            <Text style={styles.header}>Discover</Text>
            <Image 
                source={require('../../assets/images/pp.jpg')}
                style={styles.profileIcon}
            />
        </View>

      {/* Events Section */}
      <Text style={styles.subHeader}>Mumbai</Text>
      <Text style={styles.sectionTitle}>Popular Events</Text>
      <ScrollView 
        style={styles.eventsContainer} 
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {groupedEvents.map((column, columnIndex) => (
          <View key={`column-${columnIndex}`} style={styles.eventColumn}>
            {column.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventItem}
                onPress={() => alert(`Clicked on ${event.title}`)}
              >
                <Image
                    source={
                        typeof event.image === 'string'
                        ? { uri: event.image } // Handle remote images
                        : event.image // Handle local images (require)
                    }
                    style={styles.eventImage}
                />
                <View style={styles.eventText}>
                  <Text style={styles.eventOrganizer}>{event.organizer}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventBook}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    {/* <TouchableOpacity style={styles.eventButton}>
                        <Text style={styles.eventCalendar}>Add to Calendar</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Startups Section */}
      <Text style={styles.subHeader}>Top Startups</Text>
      <Text style={styles.sectionTitle}>Popular Innovations</Text>
      <ScrollView style={styles.startupsList} horizontal>
        {groupedStartUps.map((column, columnIndex) => (
          <View key={`column-${columnIndex}`} style={styles.startupMapper}>
            {column.map((startup) => (
              <View key={startup.id} style={styles.startupItem}>
                <Image
                    source={
                        typeof startup.image === 'string'
                        ? { uri: startup.image } // Handle remote images
                        : startup.image // Handle local images (require)
                    }
                    style={styles.startupImage}
                />
                <View style={styles.startupText}>
                  <Text style={styles.startupCreator}>{startup.creator}</Text>
                  <Text style={styles.startupName}>{startup.name}</Text>
                  <Text style={styles.startupDescription}>{startup.description}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ScrollView>
    <BottomNav></BottomNav>
    </>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    //   paddingLeft: 28,
      marginTop: 32,
    },
    topNavBar: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 28
    },
    header: {
      fontSize: 32,
    //   fontWeight: 'bold',
      marginTop: 20,
      fontFamily: 'Raleway-Regular'
    },
    profileIcon: {
        height: 40,
        width: 40,
        borderRadius: 100
    },
    subHeader: {
      fontSize: 22,
      color: '#000',
      fontFamily: 'Raleway-SemiBold',
      marginTop: 24,
      paddingHorizontal: 28
    },
    sectionTitle: {
      fontSize: 18,
    //   fontWeight: 'bold',
      color: '#939393',
      fontFamily: 'Raleway-Medium',
    //   marginTop: 20,
        paddingHorizontal: 28
    },
    eventsContainer: {
      flexDirection: 'row',
      marginTop: 10,
      paddingLeft: 28
    },
    eventColumn: {
      flex: 1,
      marginRight: 15,
    },
    eventItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    //   backgroundColor: '#f8f8f8',
      borderRadius: 8,
    //   padding: 10,
      height: 100, // Set consistent height for each event
      width: 300, // Increased width for better layout
    },
    eventImage: {
      width: 80, // Increased width of the image
      height: 80, // Ensure consistent height for the image
      borderRadius: 10,
      marginRight: 10,
    },
    eventText: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-evenly",
      height: "100%"
    },
    eventOrganizer: {
      fontSize: 12,
      color: '#000',
      fontWeight: "300",
      fontFamily: 'Raleway-Light'
    },
    eventTitle: {
      fontSize: 16,
      fontFamily: 'Raleway-Medium',
    },
    eventBook: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    eventTime: {
      fontSize: 12,
      color: '#000',
      fontWeight: "200",
      fontFamily: 'Raleway-Light'
    },
    eventButton: {
        backgroundColor: '#373839',
        opacity: 0.75,
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 4
    },
    eventCalendar: {
        fontFamily: 'Raleway-Normal',
        fontSize: 10,
        color: '#fff'
    },
    startupsList: {
      marginTop: 20,
      flexDirection: 'row',
      paddingLeft : 28,
    },
    startupMapper: {
        flex: 1,
    },
    startupItem: {
      flexDirection: 'row',
      marginBottom: 15,
      height: 140,
      width: 300,
      marginRight: 15
    },
    startupImage: {
      width: 120,
      height: 120,
      borderRadius: 10,
      marginRight: 10,
    },
    startupText: {
      flex: 1,
    },
    startupCreator: {
        fontSize: 12,
        color: '#000',
        fontWeight: "300",
        fontFamily: 'Raleway-Light'
    },
    startupName: {
        fontSize: 16,
        fontFamily: 'Raleway-Medium',
        marginBottom: 4
    },
    startupDescription: {
        fontSize: 10,
        color: '#000',
        fontWeight: "300",
        fontFamily: 'Raleway-Light'
    },
  });
  

export default Discover;
