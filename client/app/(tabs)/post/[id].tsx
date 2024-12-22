import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Button,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/supabaseClient'; // Assuming you have supabase configured

const PostDetail: React.FC = () => {
    const { profileImage, userName, content, postImage, createdAt, likes, comments, id } = useLocalSearchParams();
    const [commentText, setCommentText] = useState('');
    const [commentList, setCommentList] = useState<any[]>([]); // Store array of comments with username
    const navigation = useNavigation();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (!id) {
                    console.log('Error: postId is undefined');
                    return;
                }

                // Get user_id from AsyncStorage
                const authToken = await AsyncStorage.getItem('authToken');
                if (!authToken) {
                    console.log('User is not authenticated');
                    return;
                }

                // Debugging - Check values of authToken and postId
                console.log('authToken:', authToken);
                console.log('postId:', id);

                // Fetch comments for the post from the 'comments' table
                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments')
                    .select('content, user_id')
                    .eq('post_id', id);

                if (commentsError) {
                    console.error('Error fetching comments:', commentsError);
                    return;
                }

                if (commentsData && commentsData.length > 0) {
                    // Fetch username for each comment using user_id
                    const commentsWithUsernames = await Promise.all(
                        commentsData.map(async (comment) => {
                            const { data: userData, error: userError } = await supabase
                                .from('profiles')
                                .select('username')
                                .eq('user_id', comment.user_id)
                                .single();

                            if (userError) {
                                console.error('Error fetching username:', userError);
                                return;
                            }

                            return {
                                content: comment.content,
                                userName: userData?.username || 'Anonymous',
                            };
                        })
                    );

                    // Filter out undefined results
                    setCommentList(commentsWithUsernames.filter((comment) => comment !== undefined));
                } else {
                    console.log('No comments available for this post');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (id) {
            fetchComments();
        } else {
            console.log('Error: postId is undefined');
        }
    }, [id]); // Re-fetch when postId changes

    const handleAddComment = async () => {
        try {
            if (!commentText.trim()) {
                console.log('Comment text is empty');
                return;
            }

            // Get user_id from AsyncStorage
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                console.log('User is not authenticated');
                return;
            }

            // Debugging - Check values of authToken and commentText
            console.log('authToken:', authToken);
            console.log('commentText:', commentText);

            // Insert comment into the 'comments' table
            const { error } = await supabase.from('comments').insert([
                {
                    post_id: id,
                    user_id: authToken, // Use user_id from AsyncStorage
                    content: commentText,
                },
            ]);

            if (error) {
                console.error('Error submitting comment:', error);
                return;
            }

            setCommentText(''); // Clear the input field after comment submission
            // Optionally, fetch updated comments after adding a new comment
            fetchComments(); // Re-fetch comments to show the newly added one
        } catch (error) {
            console.error('Error handling comment submission:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text
                onPress={() => {
                    navigation.goBack();
                }}
            >
                back
            </Text>
            {/* Post Details */}
            <View style={styles.header}>
                <Image source={{ uri: Array.isArray(profileImage) ? profileImage[0] : profileImage }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {userName || 'Anonymous'}{' '}
                        <Text style={styles.timeAgo}>· {new Date(createdAt as string).toLocaleDateString()}</Text>
                    </Text>
                </View>
            </View>

            <Text style={styles.content}>{content}</Text>
            {postImage && <Image source={{ uri: Array.isArray(postImage) ? postImage[0] : postImage }} style={styles.postImage} />}

            {/* Post Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="comment-outline" type="material-community" color="#657786" size={20} />
                    <Text style={styles.iconText}>{comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="heart-outline" type="material-community" color="#E0245E" size={20} />
                    <Text style={styles.iconText}>{likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="share-variant-outline" type="material-community" color="#657786" size={20} />
                </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
                <Text style={styles.sectionTitle}>Comments</Text>

                {/* Add Comment */}
                <View style={styles.addComment}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <Button title="Post" onPress={handleAddComment} color="#1DA1F2" />
                </View>

                {/* Comments List */}
                <FlatList
                    data={commentList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.commentItem}>
                            <Text style={styles.commentUserName}>{item.userName}</Text>
                            <Text style={styles.commentText}>{item.content}</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        paddingTop: 80,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 10,
    },
    userInfo: {
        flexDirection: 'column',
        flex: 1,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#14171A',
    },
    timeAgo: {
        fontSize: 12,
        color: '#657786',
    },
    content: {
        fontSize: 15,
        color: '#14171A',
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    iconText: {
        fontSize: 13,
        color: '#657786',
        marginLeft: 5,
    },
    commentsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#14171A',
        marginBottom: 10,
    },
    addComment: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 10,
        marginRight: 10,
    },
    commentItem: {
        marginBottom: 10,
    },
    commentUserName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    commentText: {
        fontSize: 14,
        color: '#14171A',
    },
    noComments: {
        fontStyle: 'italic',
        color: '#657786',
    },
});

export default PostDetail;
function fetchComments() {
    throw new Error('Function not implemented.');
}

