import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
    Pressable,
    Animated,
    TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/supabaseClient';
import { BlurView } from 'expo-blur';

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

export default function Business() {

    const navigation = useNavigation();
    const { id } = useLocalSearchParams();

    const [startup, setStartup] = useState<Startup | null>(null);
    const [loading, setLoading] = useState(true);
    // const [isModalVisible, setModalVisible] = useState(false);
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [fundingType, setFundingType] = useState<'money' | 'equity'>('money');
    const [inputAmount, setInputAmount] = useState('');
    const [inputEquity, setInputEquity] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [fundingAmount, setFundingAmount] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const scrollY = useRef(new Animated.Value(0)).current;


    const fetchStartupById = async (startupId: string | undefined) => {
        try {
            if (!startupId) return;
            setLoading(true);

            const { data, error } = await supabase
                .from('startups')
                .select(
                    'id, name, description, logo, backdrop, location, followers, mission, team, jobs'
                )
                .eq('id', startupId)
                .single();

            if (error) {
                console.error('Error fetching startup:', error);
                Alert.alert('Error', 'Failed to load startup data.');
                return;
            }

            // Transform data to match the Startup interface
            setStartup({
                id: data.id.toString(),
                name: data.name,
                desc: data.description,
                logo: data.logo, // Use plain string for logo URL
                backdrop: data.backdrop, // Use plain string for backdrop URL
                location: data.location,
                followers: data.followers,
                mav: data.mission,
                team: data.team.map((member: any) => ({
                    id: member.id,
                    name: member.name,
                    role: member.role,
                    profileLink: member.profileLink,
                    image: { uri: member.image },
                })),
                job: data.jobs.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    company: job.company,
                    time: job.time,
                })),
            });
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    const confirmFunding = () => {
        const amount = parseFloat(inputAmount);
        if (isNaN(amount) || amount <= 0) return;

        console.log({
            fundingType,
            amount,
            description: descriptionText,
        });

        setFundingAmount(prev => prev + amount);
        setShowFundingModal(false);
        setInputAmount('');
        setInputEquity('');
        setDescriptionText('');
    };

    useEffect(() => {
        fetchStartupById(id as string);
    }, [id]);

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

    const handleFunding = () => {
        setShowFundingModal(true);
        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
        ]).start();
    };



    return (

        <ImageBackground
            source={require("../../../assets/images/event_bg.png")}
            style={styles.backgroundImage}
        >
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFundingModal}
                onRequestClose={() => setShowFundingModal(false)}
            >
                <BlurView intensity={100} style={styles.modalBlur}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Fund Proposal</Text>
                        {/* <Text style={styles.modalSubtitle}>{name}</Text> */}

                        {/* <View style={styles.fundingTypeContainer}>
                            <Pressable
                                style={[
                                    styles.fundingTypeButton,
                                    fundingType === 'money' && styles.activeFundingType,
                                ]}
                                onPress={() => setFundingType('money')}
                            >
                                <Text style={styles.fundingTypeText}>Money</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.fundingTypeButton,
                                    fundingType === 'equity' && styles.activeFundingType,
                                ]}
                                onPress={() => setFundingType('equity')}
                            >
                                <Text style={styles.fundingTypeText}>Equity</Text>
                            </Pressable>
                        </View> */}

                        <View style={styles.inputContainer}>
                            <Text style={styles.dollarSign}>
                                %
                            </Text>
                            <TextInput
                                style={styles.amountInput}
                                value={inputEquity}
                                onChangeText={setInputEquity}
                                keyboardType="decimal-pad"
                                placeholder="Enter Equity"
                                placeholderTextColor="#808080"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.dollarSign}>
                                Rs.
                            </Text>
                            <TextInput
                                style={styles.amountInput}
                                value={inputAmount}
                                onChangeText={setInputAmount}
                                keyboardType="decimal-pad"
                                placeholder="Enter amount"
                                placeholderTextColor="#808080"
                            />
                        </View>

                        <TextInput
                            style={styles.descriptionInput}
                            value={descriptionText}
                            onChangeText={setDescriptionText}
                            placeholder="Enter description (optional)"
                            placeholderTextColor="#808080"
                            multiline
                        />

                        <Pressable style={styles.confirmButton} onPress={confirmFunding}>
                            <Text style={styles.confirmButtonText}>Confirm Funding Proposal</Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setShowFundingModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </BlurView>
            </Modal>
            <Text style={{
                marginTop: 50,
                marginLeft: 20,
                fontSize: 18,
                color: 'white',
                fontWeight: 'bold',
                paddingBottom: 10
            }}
                onPress={() => { navigation.goBack() }}>
                Back
            </Text>

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
                        <TouchableOpacity style={styles.actionButton} onPress={handleFunding}>
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

                            <Text style={styles.actionText}>UpVote</Text>
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
                        {startup?.job.map((member) => (
                            <View key={member.id} style={styles.jobCard}>
                                <Image
                                    source={
                                        typeof startup?.logo === 'string'
                                            ? { uri: startup.logo } // Remote URI
                                            : startup?.logo // Local require
                                    }
                                    style={styles.jobImage}
                                />
                                <View style={styles.jobDetails}>
                                    <Text style={styles.jobTitle}>{member.title}</Text>
                                    <Text style={styles.jobCompany}>{member.company}</Text>
                                    <Text style={styles.jobTime}>{member.time}</Text>
                                    <TouchableOpacity style={styles.applyButton} onPress={() => Alert.alert('Apply', `You applied for ${member.title}`)}>
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
    jobImg: {
        width: 120,
        height: 120,
        marginBottom: 24,
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
        width: '100%',
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
    modalBlur: {
        flex: 1,
        justifyContent: 'flex-end',
    },


    modalSubtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 20,
    },
    fundingTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    fundingTypeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    activeFundingType: {
        backgroundColor: '#4CAF50',
    },
    fundingTypeText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    dollarSign: {
        fontSize: 24,
        color: '#FFFFFF',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        color: '#FFFFFF',
    },
    descriptionInput: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        width: '100%',

    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#808080',
        fontSize: 16,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        alignSelf: 'center',

        marginBottom: 24

    },

    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        marginTop: 4,
    },
    upvoteIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    upvoteIconActive: {
        color: '#4CAF50',
    },
    locationSection: {
        padding: 20,
        backgroundColor: '#1A1A1A',
    },

    locationText: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 10,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        color: '#808080',
        marginTop: 8,
    },
});