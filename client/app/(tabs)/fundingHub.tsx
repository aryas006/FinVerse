import { StyleSheet, Text, View, FlatList, Image, Pressable, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import BottomNav from '../Components/BottomNav';


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
};

type RootStackParamList = {
    StartupList: undefined;
    StartupDetail: { startup: StartupType };
};

const Stack = createStackNavigator<RootStackParamList>();

const FundingHub = () => {
    const [startups, setStartups] = useState([
        {
            id: '1',
            name: 'Flutter',
            description: 'Flutter Development Platform',
            image: 'https://via.placeholder.com/100',
            status: 'Seed Stage',
            raised: '$2.5M',
            industry: 'Developer Tools',
            upvotes: 324,
            isUpvoted: false
        },
        {
            id: '2',
            name: 'Zerodha',
            description: 'Modern Trading Platform',
            image: 'https://via.placeholder.com/100',
            status: 'Series A',
            raised: '$15M',
            industry: 'FinTech',
            upvotes: 892,
            isUpvoted: false
        },
        {
            id: '3',
            name: 'Facebook',
            description: 'Meta',
            image: 'https://via.placeholder.com/100',
            status: 'Seed Stage',
            raised: '$15M',
            industry: 'FinTech',
            upvotes: 892,
            isUpvoted: false
        },
        {
            id: '4',
            name: 'Google',
            description: 'Alphabet',
            image: 'https://via.placeholder.com/100',
            status: 'Series A',
            raised: '$15M',
            industry: 'FinTech',
            upvotes: 892,
            isUpvoted: false
        },
        {
            id: '5',
            name: 'Amazon',
            description: 'Amazon',
            image: 'https://via.placeholder.com/100',
            status: 'Seed Stage',
            raised: '$15M',
            industry: 'FinTech',
            upvotes: 892,
            isUpvoted: false
        }
    ]);

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
        <Link href={{
            pathname: '/startup/[id]',
            params: {
                id: item,
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
                        <Text style={styles.startupName}>{item.name}</Text>
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
        </Link>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Funding Hub</Text>
                <Text style={styles.headerDescription}>Discover innovative startups</Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Top Startups</Text>
                <Text style={styles.subTitle}>Trending in the ecosystem</Text>
            </View>
            <FlatList
                data={startups}
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
        backgroundColor: '#121212',
    },
    headerContainer: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#1E1E1E',
    },
    header: {
        fontSize: 34,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
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
    },
    startupList: {
        flex: 1,
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
});