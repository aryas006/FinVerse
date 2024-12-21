import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    ScrollView,
    Animated,
    SafeAreaView,
    Modal,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';



export default function DetailsScreen() {
    const {
        id,
        image,
        name,
        description,
        status,
        raised,
        industry,
        upvotes,
        isUpvoted,
    } = useLocalSearchParams();

    const navigation = useNavigation();

    const [currentUpvotes, setCurrentUpvotes] = useState(parseInt(Array.isArray(upvotes) ? upvotes[0] : upvotes));
    const [hasUpvoted, setHasUpvoted] = useState(isUpvoted === 'true'); // Assuming 'isUpvoted' is passed as a string

    const handleUpvote = () => {
        if (hasUpvoted) {
            // If already upvoted, decrement the upvotes
            setCurrentUpvotes(prev => prev - 1);
        } else {
            // If not upvoted, increment the upvotes
            setCurrentUpvotes(prev => prev + 1);
        }
        setHasUpvoted(!hasUpvoted);  // Toggle the upvote state
    };



    const [fundingAmount, setFundingAmount] = useState(0);
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [inputAmount, setInputAmount] = useState('');
    const [inputEquity, setInputEquity] = useState('');
    const [fundingType, setFundingType] = useState<'money' | 'equity'>('money');
    const [descriptionText, setDescriptionText] = useState('');
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [balance, setBalance] = useState(1000); // Example starting balance

    const handleAddFunds = () => {
        setBalance(balance + 100); // Add $100 to the balance
    };

    const handleWithdrawFunds = () => {
        if (balance >= 100) {
            setBalance(balance - 100); // Subtract $100 from the balance
        } else {
            alert("Insufficient balance");
        }
    };

    const imageScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.5, 1],
        extrapolateLeft: 'extend',
        extrapolateRight: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
    });

    const handleFunding = () => {
        setShowFundingModal(true);
        Animated.sequence([
            Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
        ]).start();
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

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.8,
                useNativeDriver: true,
                speed: 50,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 50,
            }),
        ]).start();

        handleUpvote();  // Directly call handleUpvote() to toggle the upvote
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text
                onPress={() => { navigation.goBack() }}
                style={{
                    color: '#FFFFFF',
                    fontSize: 18,
                    fontWeight: '100',
                    padding: 10,
                }}
            >Back</Text>
            <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
                <Text style={styles.headerTitle}>{name}</Text>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
                    <Image
                        source={{ uri: image as string }}
                        style={styles.coverImage}
                    />
                    <LinearGradient
                        colors={['transparent', '#121212']}
                        style={styles.gradientOverlay}
                    />
                </Animated.View>

                <View style={styles.content}>
                    <Text style={styles.companyName}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>${parseFloat(raised as string).toLocaleString()}</Text>
                            <Text style={styles.metricLabel}>Raised</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricValue}>{industry}</Text>
                            <Text style={styles.metricLabel}>Industry</Text>
                        </View>
                        <View style={styles.metricItem}>

                            <Text style={styles.metricValue}>{upvotes} </Text>
                            <Text style={styles.metricLabel}>Upvotes</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomBar}>
                    <Pressable style={styles.actionButton}>
                        <Ionicons name="mail-outline" size={24} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Contact</Text>
                    </Pressable>

                    <Pressable style={styles.actionButton} onPress={handlePress}>
                        <Text style={[styles.upvoteIcon, hasUpvoted && styles.upvoteIconActive]}>▲</Text>

                        <Text style={styles.actionButtonText}>UpVote</Text>
                    </Pressable>
                    <Pressable style={styles.actionButton}>
                        <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Share</Text>
                    </Pressable>

                    <Pressable style={styles.actionButton}>
                        <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Save</Text>
                    </Pressable>
                </View>

                <View style={styles.locationSection}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <Text style={styles.locationText}>Mumbai, Maharashtra</Text>
                    <View style={styles.mapPlaceholder}>
                        <Ionicons name="map-outline" size={32} color="#808080" />
                        <Text style={styles.mapText}>Map View</Text>
                    </View>
                </View>
            </ScrollView>


            <Modal
                animationType="slide"
                transparent={true}
                visible={showFundingModal}
                onRequestClose={() => setShowFundingModal(false)}
            >
                <BlurView intensity={100} style={styles.modalBlur}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Fund Proposal</Text>
                        <Text style={styles.modalSubtitle}>{name}</Text>

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



            <Pressable
                style={styles.fundButton}
                onPress={handleFunding}
            >
                <Text style={styles.fundButtonText}>Fund This Project</Text>
            </Pressable>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#121212',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 400,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2A2A2A',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    content: {
        padding: 20,
        marginTop: -40,
    },
    companyName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#B0B0B0',
        lineHeight: 24,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,

    },
    metricItem: {
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 14,
        color: '#808080',
    },
    fundButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        bottom: 20,
        width: '90%',
        alignSelf: 'center',
        paddingBottom: 20,
        position: 'absolute',
        marginBottom: 20,

    },
    fundButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    modalBlur: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
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

    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
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
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        padding: 20,
        borderRadius: 8,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
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
