import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { supabase } from '@/supabaseClient';
import { useNavigation } from 'expo-router';


const { width, height } = Dimensions.get('window');

const AIMatchMaking = () => {
    const navigation = useNavigation();
    const [userKeywords, setUserKeywords] = useState<string[] | null>(null);
    const [startups, setStartups] = useState<any[]>([]);
    const [matchResult, setMatchResult] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Function to calculate match score
    const calculateMatchScore = (arr1: string[], arr2: string[]) => {
        const set1 = new Set(arr1?.map(k => k.toLowerCase().trim()));
        const set2 = new Set(arr2?.map(k => k.toLowerCase().trim()));
        const matches = [...set1].filter(keyword => set2.has(keyword));
        return matches.length;
    };

    // Fetch user profile keywords
    const handleProfileKeyword = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        const { data, error } = await supabase
            .from('profiles')
            .select('keywords')
            .eq('user_id', session.session.user.id)

        if (error) {
            console.error('Error fetching profile:', error.message);
            return;
        }

        if (data && data[0]?.keywords) {
            setUserKeywords(data[0].keywords);
        }
    };

    // Fetch startup keywords
    const handleStartupKeyword = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        const { data, error } = await supabase
            .from('startups')
            .select('keywords, name');

        if (error) {
            console.error('Error fetching startups:', error.message);
            return;
        }

        setStartups(data);
    };

    // Find the best match based on profile and startup keywords
    const findBestMatch = () => {
        if (!userKeywords || startups.length === 0) return;

        const scores = startups.map(startup => {
            const matchScore = calculateMatchScore(userKeywords, startup.keywords);
            return { pair: startup.name, score: matchScore };
        });

        setTimeout(() => {
            const bestMatch = scores.reduce((prev, current) => (prev.score > current.score ? prev : current));
            setMatchResult(`${bestMatch.pair}\nMatch Score: ${bestMatch.score}`);
            setLoading(false);
        }, 2000);
    };

    useEffect(() => {
        handleProfileKeyword();
        handleStartupKeyword();
    }, []);

    useEffect(() => {
        if (userKeywords && startups.length > 0) {
            findBestMatch();
        }
    }, [userKeywords, startups]);

    const LoadingScreen = () => (
        <View style={styles.container}>

            <LinearGradient
                colors={['#1a237e', '#0d47a1', '#01579b']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />

            <BlurView intensity={95} tint="dark" style={styles.blurContainer}>

                <View style={styles.contentWrapper}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{


                    }}>
                        <Text>
                            Back
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Finding Your Perfect Match</Text>
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#4fc3f7" style={styles.loader} />
                        <Text style={styles.subtitle}>Analyzing potential matches...</Text>
                    </View>
                </View>
            </BlurView>
        </View>
    );

    const ResultScreen = () => (
        <View style={styles.container}>

            <LinearGradient
                colors={['#1a237e', '#0d47a1', '#01579b']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />
            <View style={{
                width: '100%',
                height: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: 50,
            }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{
                    width: 100,
                    height: 50,
                    alignItems: 'flex-start',
                    justifyContent: 'center',

                    marginLeft: 20,

                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 20,
                    }}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>


            <BlurView intensity={95} tint="dark" style={styles.blurContainer}>
                <View style={styles.contentWrapper}>
                    <Text style={styles.title}>Match Analysis Complete</Text>
                    <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                            <Text style={styles.matchTitle}>Optimal Match Found</Text>
                        </View>
                        <View style={styles.resultContent}>
                            <Text style={styles.resultText}>{matchResult}</Text>
                        </View>
                    </View>
                </View>
            </BlurView>
        </View>
    );

    return loading ? <LoadingScreen /> : <ResultScreen />;
};

export default AIMatchMaking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    blurContainer: {
        width: width * 0.9,
        maxWidth: 450,
        borderRadius: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            android: {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
        }),
    },
    contentWrapper: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 0.5,
    },
    loaderContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#90caf9',
        marginTop: 16,
        letterSpacing: 0.3,
    },
    loader: {
        marginVertical: 16,
    },
    resultCard: {
        width: '100%',
        backgroundColor: 'rgba(13, 71, 161, 0.3)',
        borderRadius: 15,
        overflow: 'hidden',
    },
    resultHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(144, 202, 249, 0.2)',
    },
    matchTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#90caf9',
        textAlign: 'center',
    },
    resultContent: {
        padding: 20,
    },
    resultText: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        lineHeight: 28,
    },
});