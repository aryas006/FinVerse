import { StyleSheet, Text, View, FlatList, Image, Pressable, Animated, Modal, Button } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import BottomNav from '../Components/BottomNav';
import { BlurView } from 'expo-blur';
import { Icon } from 'react-native-elements';
import { supabase } from '@/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    user_id: string;
    wallet: number;

};
type StartupType = {
    id: string;
    name: string;
    description: string;
    image: string;
    status: string;
    raised: string;
    industry: string;
    upvotes: number;
    isUpvoted: boolean;
    createdDate: Date;
};

type RootStackParamList = {
    StartupList: undefined;
    StartupDetail: { startup: StartupType };
};

const Stack = createStackNavigator<RootStackParamList>();

const FundingHub = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);


    const [startups, setStartups] = useState<StartupType[]>([]); // Startups state
    const [user, setUser] = useState<User | null>(null);
    const [wallet, setWallet] = useState<number>(0);
    const [moneyOnHold, setMoneyOnHold] = useState<number>(0);


    const moneyOnHoldFunc = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const { data, error } = await supabase
            .from('profiles')
            .select("money_onhold")
            .eq('user_id', session.session.user.id)

        if (error) {
            console.error('Error fetching user:', error);
            return;
        }

        if (data) {
            console.log("money : ", data[0].money_onhold);
            setMoneyOnHold(data[0].money_onhold);
        }
    }

    const user_id = async () => {
        const user_id = await AsyncStorage.getItem('authToken');
        return user_id;
    }

    const fetchUser = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const { data, error } = await supabase
            .from('profiles')
            .select("wallet")
            .eq('user_id', session.session.user.id)


        if (error) {
            console.error('Error fetching user:', error);
            return;
        }

        if (data) {
            console.log(data[0].wallet);
            setUser(data[0].wallet);
            setWallet(data[0].wallet);


        }
    };

    useEffect(() => {
        const fetchStartups = async () => {
            const { data, error } = await supabase
                .from('startups') // Your Supabase table name
                .select('*');

            if (error) {
                console.error(error);
            } else {
                setStartups(data);
            }
        };
        const moneyonhold = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (!session?.session?.user?.id) return;

            const { data, error } = await supabase
                .from('profiles')
                .select("money_onhold")
                .eq('user_id', session.session.user.id)

            if (error) {
                console.error('Error fetching user:', error);
                return;
            }

            if (data) {
                console.log("Money", data[0].money_onhold);
                setMoneyOnHold(data[0].money_onhold);
            }
        }
        fetchStartups();
        fetchUser();
        moneyonhold();
    }, []);



    const handleAddFunds = async () => {
        if (!user) return;
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;

        const newBalance = wallet + 100;
        const { error } = await supabase
            .from('profiles')
            .update({ wallet: newBalance })
            .eq('user_id', session.session.user.id);

        if (error) {
            console.error('Error adding funds:', error);
            return;
        }

        // Fetch updated user data
        fetchUser();
    };

    const handleWithdrawFunds = async () => {
        if (!user) return;
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        if (user) {
            if (wallet >= 100) {
                const newBalance = 0;
                const { error } = await supabase
                    .from('profiles')
                    .update({ wallet: newBalance })
                    .eq('user_id', session.session.user.id);

                if (error) {
                    console.error(error);
                } else {
                    // setUser(data); // Update the user state with the new balance
                }
            } else {
                alert("Insufficient balance");
            }
        }
        fetchUser();
    };







    const handleUpvote = (id: string) => {
        setStartups(startups.map(startup => {
            if (startup.id === id) {
                return {
                    ...startup,
                    upvotes: startup.isUpvoted ? startup.upvotes - 1 : startup.upvotes + 1,
                    isUpvoted: !startup.isUpvoted
                };
            }
            return startup;
        }));
    };

    const renderStatusBadge = (status: string) => {
        const getStatusColor = () => {
            switch (status) {
                case 'Seed Stage':
                    return 'rgba(251, 140, 0, 0.2)';
                case 'Series A':
                    return 'rgba(76, 175, 80, 0.2)';
                default:
                    return 'rgba(33, 150, 243, 0.2)';
            }
        };

        const getStatusTextColor = () => {
            switch (status) {
                case 'Seed Stage':
                    return '#FB8C00';
                case 'Series A':
                    return '#4CAF50';
                default:
                    return '#2196F3';
            }
        };

        return (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                <Text style={[styles.statusText, { color: getStatusTextColor() }]}>{status}</Text>
            </View>
        );
    };

    const UpvoteButton = ({ count, isUpvoted, onPress }: { count: number, isUpvoted: boolean, onPress: () => void }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

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
            onPress();

        };

        return (
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>

                <Pressable
                    onPress={handlePress}

                    style={[
                        styles.upvoteButton,
                        isUpvoted && styles.upvoteButtonActive
                    ]}
                >
                    <Text style={[
                        styles.upvoteIcon,
                        isUpvoted && styles.upvoteIconActive
                    ]}>▲</Text>
                    <Text style={[
                        styles.upvoteCount,
                        isUpvoted && styles.upvoteCountActive
                    ]}>{count}</Text>
                </Pressable>

            </Animated.View>
        );
    };
    const navigation = useNavigation();
    const renderStartup = ({ item }: { item: any }) => (
        <View style={styles.startupContainer}>

            <View>
                <Image source={{ uri: item.image }} style={styles.startupImage} />

                <View style={styles.upvoteContainer}>
                    <UpvoteButton
                        count={item.upvotes}
                        isUpvoted={item.isUpvoted}
                        onPress={() => handleUpvote(item.id)}
                    />
                </View>
            </View>


            <View style={styles.startupDetails}>
                <View style={styles.startupHeader}>
                    <Link href={{
                        pathname: '/business/[id]',
                        params: {
                            id: item.id,
                            image: item.image,
                            name: item.name,
                            description: item.description,
                            status: item.status,
                            raised: item.raised,
                            industry: item.industry,
                            upvotes: item.upvotes,
                            isUpvoted: item.isUpvoted
                        },
                    }}>
                        <Text style={styles.startupName}>{item.name}</Text>
                    </Link>
                    {renderStatusBadge(item.status)}
                </View>
                <Text style={styles.startupDescription}>{item.description}</Text>
                <View style={styles.startupMetrics}>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Raised</Text>
                        <Text style={styles.metricValue}>{item.raised}</Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={styles.metricLabel}>Industry</Text>
                        <Text style={styles.metricValue}>{item.industry}</Text>
                    </View>
                </View>
            </View>
        </View>

    );

    const [selectedFilter, setSelectedFilter] = useState('Top');

    const filteredStartups = startups.filter(startup => {
        if (selectedFilter === 'Top') {
            return startup.upvotes > 500; // Filter for "Top Startups" based on upvotes
        } else if (selectedFilter === 'New') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return startup.createdDate >= oneMonthAgo; // Filter for "New Startups"
        }
        return true; // Default to show all
    });

    const renderFilterButtons = () => (
        <View style={styles.filterContainer}>
            <Pressable
                style={[styles.filterButton, selectedFilter === 'Top' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('Top')}
            >
                <Text style={styles.filterButtonText}>Top Startups</Text>
            </Pressable>
            <Pressable
                style={[styles.filterButton, selectedFilter === 'New' && styles.filterButtonActive]}
                onPress={() => setSelectedFilter('New')}
            >
                <Text style={styles.filterButtonText}>New Startups</Text>
            </Pressable>
        </View>
    );

    const handleWallet = () => {
        setIsModalVisible((prevState) => !prevState);
    };

    const getFilteredStartups = () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        let filtered = [...startups];

        switch (selectedFilter) {
            case 'Top':
                filtered = filtered.filter(startup => startup.upvotes >= 600);
                break;
            case 'New':
                filtered = filtered.filter(startup => {
                    const startupDate = new Date(startup.createdDate);
                    return startupDate >= oneMonthAgo;
                });
                break;
            case 'All':
                // No filtering needed for 'All'
                break;
        }

        return filtered.sort((a, b) => b.upvotes - a.upvotes);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>

            <BlurView intensity={50} tint="light" style={styles.headerContainer}>
                <View>
                    <Text style={styles.header}>Funding Hub</Text>
                    <Text style={styles.headerDescription}>Discover innovative startups</Text>
                </View>
                <View>
                    <Pressable onPress={handleWallet}>
                        <Icon name="wallet" type="material-community" color="white" size={30} />
                    </Pressable>
                </View>
            </BlurView>
            {/* Wallet Modal */}
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
            // onRequestClose={() => setIsModalVisible(false)}
            >
                <BlurView intensity={0} tint="dark" style={styles.modalBackground}>
                    <BlurView intensity={90} tint='dark' style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Wallet</Text>
                        <Text style={styles.modalBalance}>Current Balance</Text>
                        <Text style={{ fontSize: 40, fontWeight: 500, color: 'white' }}> Rs.{wallet}</Text>

                        <View style={styles.modalButtonContainer}>
                            <View style={{ backgroundColor: 'black', borderRadius: 5, width: '100%' }}>
                                <Button title="Add Funds" onPress={handleAddFunds} />
                            </View>
                            <View style={{ backgroundColor: 'black', borderRadius: 5, width: '100%' }}>
                                <Button title="Withdraw Funds" onPress={handleWithdrawFunds} />
                            </View>
                            <View style={{
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                                marginTop: 20,
                                gap: 10
                            }}>
                                <Text style={{ color: 'grey' }}>Money on hold:</Text>
                                <Text style={{ fontSize: 40, fontWeight: 500, color: 'white' }}>Rs.{moneyOnHold}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => setIsModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </BlurView>
                </BlurView>
            </Modal>


            {/* <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Top Startups</Text>
                <Text style={styles.subTitle}>Trending in the ecosystem</Text>
            </View> */}

            <View style={styles.filterContainer}>
                {['All', 'Top', 'New'].map((filter) => (
                    <Pressable
                        key={filter}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedFilter(filter)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            selectedFilter === filter && styles.filterButtonTextActive
                        ]}>
                            {filter} Startups
                        </Text>
                    </Pressable>
                ))}
            </View>

            <FlatList
                data={getFilteredStartups()}
                renderItem={renderStartup}
                keyExtractor={(item) => item.id}
                style={styles.startupList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            <BottomNav></BottomNav>
        </View>
    );
};

export default FundingHub;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerContainer: {
        padding: 24,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        position: 'absolute', // Ensure it overlays the content
        top: 0,
        width: '100%',
        zIndex: 10, // Bring it above other elements
    },

    header: {
        fontSize: 34,
        fontWeight: '700',
        letterSpacing: -0.5,
        color: 'white',
    },
    headerDescription: {
        fontSize: 16,
        color: '#B0B0B0',
        marginTop: 4,
    },
    sectionContainer: {
        padding: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    subTitle: {
        fontSize: 16,
        color: '#B0B0B0',
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
        gap: 16,

        paddingBottom: 100,
    },
    startupList: {


    },
    startupContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',


    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    startupImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
    },
    startupDetails: {
        marginLeft: 16,
        flex: 1,
    },
    startupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    startupName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    startupDescription: {
        fontSize: 14,
        color: '#B0B0B0',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    startupMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    metric: {
        marginRight: 24,
    },
    metricLabel: {
        fontSize: 12,
        color: '#808080',
        marginBottom: 2,
    },
    metricValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    upvoteContainer: {
        marginTop: 16,
        alignItems: 'flex-end',

    },
    upvoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    upvoteButtonActive: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    upvoteIcon: {
        color: '#808080',
        fontSize: 14,
        marginRight: 6,
    },
    upvoteIconActive: {
        color: '#4CAF50',
    },
    upvoteCount: {
        color: '#808080',
        fontSize: 14,
        fontWeight: '500',
    },
    upvoteCountActive: {
        color: '#4CAF50',
    },
    modalBackground: {
        flex: 1,
        marginTop: 168,
        alignItems: 'center',

    },
    modalContainer: {
        width: '91%',
        padding: 24,
        borderRadius: 16,

    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: 'white',
    },
    modalBalance: {
        fontSize: 18,
        marginBottom: 24,
        color: 'grey',
    },
    modalButtonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 16,
        marginTop: 20,
        gap: 10,

    },
    closeButton: {
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,

        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 16,
        paddingTop: 160,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
    },
    filterButtonActive: {
        backgroundColor: '#4CAF50',
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
});