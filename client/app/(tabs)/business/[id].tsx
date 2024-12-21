import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Share,
    Alert,
    Modal,
    ImageSourcePropType,
    ImageBackground,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    profileLink: string;
    image: ImageSourcePropType;
}

interface JobPosting {
    id: string;
    title: string;
    company: string;
    time: string;
}

interface Startup {
    id: string;
    name: string;
    desc: string;
    logo: string;
    backdrop: string;
    location: string;
    followers: number;
    mav: string;
    team: TeamMember[];
    job: JobPosting[];

}

// const teamMembers: TeamMember[] = [
//     {
//         id: '1',
//         name: 'John Doe',
//         role: 'CEO',
//         profileLink: 'https://example.com/johndoe',
//         image: '../../assets/images/image 1.png',
//     },
//     {
//         id: '2',
//         name: 'Jane Smith',
//         role: 'CTO',
//         profileLink: 'https://example.com/janesmith',
//         image: '../../assets/images/image 1.png',
//     },
//     {
//         id: '3',
//         name: 'Alice Johnson',
//         role: 'Co-founder',
//         profileLink: 'https://example.com/alicejohnson',
//         image: '../../assets/images/image 1.png',
//     },
// ];

const jobPostings: JobPosting[] = [
    {
        id: '1',
        title: 'Software Engineer',
        company: 'TechCorp',
        time: 'Today, 2:00 pm',
    },
    {
        id: '2',
        title: 'UI/UX Designer',
        company: 'Designify',
        time: 'Today, 4:00 pm',
    },
    {
        id: '3',
        title: 'Data Analyst',
        company: 'DataWorld',
        time: 'Tomorrow, 10:00 am',
    },
];

const startupInfo: Startup[] = [
    {
        id: "1",
        name: "Bayrack",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/st_a.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "Thane, Mumbai",
        
        followers: 1000,
        mav: "If you don’t want to waste 100s of hours doing Leetcode problems and miss your shot in technical interviews.",
        team: [
            {
                id: "t1",
                name: "Arya",
                role: "Founder",
                profileLink: "https://linkedin.com/in/arya",
                image: { uri: "data:image/jpeg;base64,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"},
            },
            {
                id: "t2",
                name: "Zuzu",
                role: "Developer",
                profileLink: "https://linkedin.com/in/arya",
                image: { uri: "data:image/jpeg;base64,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"},
            },
        ],
        job: [
            {
                id: "j1",
                title: "Product Manager",
                company: "Bayrack",
                time: "Full-Time",
            }
        ],
    },
    {
        id: "2",
        name: "Kite",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/st_b.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "UP",
        
        followers: 2000,
        mav: "700",
        team: [
            {
                id: "t2",
                name: "Zerodha",
                role: "Creator",
                profileLink: "https://linkedin.com/in/zerodha",
                image: { uri: "https://example.com/images/zerodha.jpg" },
            },
        ],
        job: [
            {
                id: "j2",
                title: "Marketing Specialist",
                company: "Kite",
                time: "Part-Time",
            },
        ],
    },
    {
        id: "3",
        name: "1px",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/event_icon_b.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "Thane, Mumbai",
        
        followers: 1500,
        mav: "600",
        team: [
            {
                id: "t3",
                name: "Arya",
                role: "Founder",
                profileLink: "https://linkedin.com/in/arya",
                image: { uri: "https://example.com/images/arya.jpg"},
            },
        ],
        job: [
            {
                id: "j3",
                title: "Graphic Designer",
                company: "1px",
                time: "Contract",
            },
        ],
    },
    {
        id: "4",
        name: "RedChillies",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/event_b.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "Unknown",
        
        followers: 3000,
        mav: "1000",
        team: [
            {
                id: "t4",
                name: "SRK",
                role: "Founder",
                profileLink: "https://linkedin.com/in/srk",
                image: { uri : "https://example.com/images/srk.jpg"},
            },
        ],
        job: [
            {
                id: "j4",
                title: "Event Coordinator",
                company: "RedChillies",
                time: "Freelance",
            },
        ],
    },
    {
        id: "5",
        name: "MCA",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/event_icon_b.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "Unknown",
        
        followers: 1800,
        mav: "800",
        team: [
            {
                id: "t5",
                name: "Parth",
                role: "Manager",
                profileLink: "https://linkedin.com/in/parth",
                image: {uri : "https://example.com/images/parth.jpg"},
            },
        ],
        job: [
            {
                id: "j5",
                title: "Software Engineer",
                company: "MCA",
                time: "Full-Time",
            },
        ],
    },
    {
        id: "6",
        name: "Cwrazy Club",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut ultricies ligula.",
        logo: require('../../../assets/images/st_b.png'),
        backdrop: require('../../../assets/images/bg_banner.jpg'),
        location: "Unknown",
        
        followers: 2200,
        mav: "900",
        team: [
            {
                id: "t6",
                name: "Praju",
                role: "Founder",
                profileLink: "https://linkedin.com/in/praju",
                image: {uri : "https://example.com/images/praju.jpg"},
            },
        ],
        job: [
            {
                id: "j6",
                title: "Business Analyst",
                company: "Cwrazy Club",
                time: "Part-Time",
            },
        ],
    },
];






export default function Business() {

    const { id } = useLocalSearchParams();

    const startup = startupInfo.find((startup) => startup.id === id);

    const [isModalVisible, setModalVisible] = useState(false);


    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out Framer, a powerful design and prototyping tool: https://framer.com',
            });
        } catch (error) {
            console.error('Error sharing content:', error);
        }
    };

    const handleFollow = () => {
        setModalVisible(false);
        Alert.alert('Followed', 'You are now following this startup!');
    };

    const handleConnect = () => {
        setModalVisible(false);
        Alert.alert('Connection Request Sent', 'You have sent a connection request!');
    };


    return (
        
            <ImageBackground
                source={require("../../../assets/images/event_bg.png")}
                style={styles.backgroundImage}
            >
                <ScrollView style={styles.container}>
                    {/* Background Image */}
                    

                    {/* Header Section */}
                    {/* <Image
                        source={
                            typeof startup?.backdrop === 'string'
                                ? { uri: startup.backdrop } // Remote URI
                                : startup?.backdrop // Local require
                        }
                        style={styles.backdrop}
                    /> */}
                    <View style={styles.header}>
                        <Image
                            source={
                                typeof startup?.logo === 'string'
                                    ? { uri: startup.logo } // Remote URI
                                    : startup?.logo // Local require
                            }
                            style={styles.logo}
                        />

                        <Text style={styles.title}>{startup?.name}</Text>
                        <Text style={styles.description}>
                            {startup?.desc}
                        </Text>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Image
                                    source={require("../../../assets/images/coin_icon.png")}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.actionText}>Fund</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Image
                                    source={require("../../../assets/images/mail_icon.png")}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.actionText}>Contact</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                                <Image
                                    source={require("../../../assets/images/share_icon.png")}
                                    style={styles.menuIcon}
                                />
                                <Text style={styles.actionText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                                <Image
                                    source={require("../../../assets/images/menu_icon.png")}
                                    style={styles.menuIconB}
                                />
                                <Text style={styles.actionText}>More</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Followers Section */}
                        <View style={styles.followersSection}>
                            <Text style={styles.followersText}>{startup?.followers} Followers</Text>
                            {/* <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followersTextButton}>Follow</Text>
                            </TouchableOpacity> */}
                            <View style={styles.teamActionsContainer}>
                                        <TouchableOpacity style={styles.teamActionButton} >
                                            <Text style={styles.teamActionText}>Follow</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.teamActionButtonConnect} >
                                            <Text style={styles.teamActionText}>Connect</Text>
                                        </TouchableOpacity>
                                    </View>
                        </View>
                        <View style={styles.line} />
                        <Text style={styles.location}>{startup?.location}</Text>
                    </View>

                    {/* Map Section */}
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: 19.076,
                                longitude: 72.8777,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                        >
                            <Marker
                                coordinate={{ latitude: 19.076, longitude: 72.8777 }}
                                title="Framer"
                                description="Location of Framer office in Mumbai."
                            />
                        </MapView>
                    </View>


                    {/* Modal for More Options */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>More Options</Text>
                                <TouchableOpacity style={styles.modalButton} onPress={handleFollow}>
                                    <Text style={styles.modalButtonText}>Follow</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={handleConnect}>
                                    <Text style={styles.modalButtonText}>Connect</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalCloseText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    

                    {/* Mission and Vision Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mission and Vision</Text>
                        <Text style={styles.sectionContent}>
                            {startup?.mav}
                        </Text>
                    </View>

                    {/* Team Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Team Information</Text>
                        {startup?.team.map((member) => (
                            <View key={member.id} style={styles.teamMemberContainer}>
                                <Image
                                    // source={
                                    //     typeof startup?.logo === 'string'
                                    //         ? { uri: member.image } // Remote URI
                                    //         : member.image // Local require
                                    // }
                                    source={member.image}
                                    style={styles.pp}
                                />
                                <View style={styles.teamMemberDetails}>
                                    <View>
                                        <Text style={styles.teamMemberText}>{`${member.name}`}</Text>
                                        <Text style={styles.teamMemberRole}>{`${member.role}`}</Text>
                                    </View>
                                    <View style={styles.teamActionsContainer}>
                                        <TouchableOpacity style={styles.teamActionButton} onPress={() => Alert.alert('Follow', `You followed ${member.name}`)}>
                                            <Text style={styles.teamActionText}>Follow</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.teamActionButtonConnect} onPress={() => Alert.alert('Connect', `You sent a connection request to ${member.name}`)}>
                                            <Text style={styles.teamActionText}>Connect</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>

                    

                    {/* Job Opportunities Section */}
                    <View style={styles.jobOpportunitiesSection}>
                        <Text style={styles.sectionTitle}>Open Job Opportunities</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobScrollContainer}>
                            {startup?.job.map((job) => (
                                <View key={job.id} style={styles.jobCard}>
                                    <Image source={require('../../../assets/images/pp.jpg')} style={styles.jobImage} />
                                    <View style={styles.jobDetails}>
                                        <Text style={styles.jobTitle}>{job.title}</Text>
                                        <Text style={styles.jobCompany}>{job.company}</Text>
                                        <Text style={styles.jobTime}>{job.time}</Text>
                                        <TouchableOpacity style={styles.applyButton} onPress={() => Alert.alert('Apply', `You applied for ${job.title}`)}>
                                            <Text style={styles.applyButtonText}>Apply</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </ImageBackground>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f8f9fa',
        backgroundAttachment: require("../../../assets/images/event_bg.png"),
        backfaceVisibility: "visible",
        backgroundSize: "cover",

        paddingTop: 50, // Added padding to shift everything down
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 300, // Increased height for better fit
        zIndex: -1,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    header: {
        // alignItems: 'center',
        padding: 20,
        // backgroundColor: '#ffffff',
        // borderBottomWidth: 1,
        // borderBottomColor: '#e0e0e0',
    },
    logo: {
        width: 160,
        height: 160,
        borderRadius: 20,
        marginBottom: 24,
        marginTop: 64,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.55,
        shadowRadius: 4.65,
        // Shadow for Android
        elevation: 8,
        marginHorizontal: "auto"
    },
    pp: {
        width: 160,
        height: 160,
        borderRadius: 20,
        marginVertical: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.55,
        shadowRadius: 4.65,
        // Shadow for Android
        elevation: 8,
        marginHorizontal: "auto"
    },
    backdrop: {
        width: "100%",
        height: 200,
        
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Raleway-SemiBold',
        textAlign: "center"
    },
    description: {
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 10,
        color: '#CDCDCD',
        fontFamily: 'Raleway-Light'
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        width: '100%',
    },
    actionButton: {
        backgroundColor: 'rgba(156, 156, 156, 0.25)',
        paddingBottom: 12,
        paddingTop: 22,
        paddingHorizontal: 18,
        borderRadius: 16,
        width: "23%",
        alignItems: "center",
        gap: 10
    },
    menuIcon: {
        height: 32,
        width: 32
    },
    menuIconB: {
        height: 9.5, 
        width: 32,
        marginVertical: 11
    },
    actionText: {
        color: '#fff',
        fontSize: 12
        
    },
    followersSection: {
        alignItems: 'center',
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    followButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'rgba(0, 159, 251, 0.5)',
        borderRadius: 12
    },
    followersText: {
        fontSize: 18,
        // fontWeight: 'bold',
        color: "#fff",
        fontFamily: 'Raleway-Medium'
    },
    followersTextButton: {
        fontSize: 14,
        // fontWeight: 'bold',
        color: "#fff",
        fontFamily: 'Raleway-Medium'
    },
    section: {
        marginBottom: 0,
        paddingHorizontal: 20,
        marginTop: 48,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
        fontFamily: "Raleway-Medium"
    },
    sectionContent: {
        fontSize: 14,
        color: '#CDCDCD',
        marginBottom: 0,
        fontFamily: 'Raleway-Regular'
    },
    teamMemberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        // height: "100%"
        // marginBottom: 15,
    },
    teamMemberImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    teamMemberDetails: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 40
    },
    teamMemberText: {
        fontSize: 18,
        fontFamily: 'Raleway-Medium',
        color: '#fff',
        marginBottom: 5,
    },
    teamMemberRole: {
        fontSize: 16,
        color: '#CDCDCD',
        fontFamily: 'Raleway-Regular',
        marginBottom: 5,
    },
    teamActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    teamActionButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'rgba(0, 159, 251, 0.5)',
        borderRadius: 6,
        marginRight: 10,
    },
    teamActionButtonConnect: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 6,
        marginRight: 10,
    },
    teamActionText: {
        color: '#fff',
        fontSize: 14,
    },
    jobOpportunitiesSection: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    jobScrollContainer: {
        marginTop: 10,
    },
    jobCard: {
        backgroundColor: 'rgba(156, 156, 156, 0.25)',
        borderRadius: 16,
        marginRight: 15,
        padding: 4,
        // paddingBottom: 14,
        width: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 40
    },
    jobImage: {
        width: '100%',
        height: 100,
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        borderBottomEndRadius: 2,
        borderBottomStartRadius: 2,
        marginBottom: 10,
    },
    jobDetails: {
        // alignItems: 'center',
    },
    jobTitle: {
        fontSize: 18,
        // fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Raleway-Medium'
        // marginBottom: 5,
    },
    jobCompany: {
        fontSize: 12,
        color: '#CDCDCD',
        fontFamily: 'Raleway-Regular',
        marginBottom: 5,
    },
    jobTime: {
        fontSize: 12,
        color: '#CDCDCD',
        marginBottom: 10,
    },
    applyButton: {
        backgroundColor: 'rgba(0, 159, 251, 0.5)',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderTopEndRadius: 2,
        borderTopStartRadius: 2,
        borderBottomEndRadius: 12,
        borderBottomStartRadius: 12,
        // textAlign: "center"
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: "center"
    },
    mapContainer: {
        height: 250,
        marginHorizontal: 20,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    map: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalCloseButton: {
        marginTop: 10,
    },
    modalCloseText: {
        color: '#007bff',
        fontSize: 16,
    },
    location: {
        marginTop: 6,
        color: "#CDCDCD",
        fontSize: 16,
        fontFamily: 'Raleway-Medium'
    },
    line: {
        height: 0.5,
        backgroundColor: '#fff', // Example color
        width: '100%', // Full width of the container
        marginVertical: 16,
        marginHorizontal: "auto"
    },
});