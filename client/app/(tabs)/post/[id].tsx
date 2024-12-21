import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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

const PostDetail: React.FC = () => {
    const { profileImage, userName, content, postImage, createdAt, likes, comments } = useLocalSearchParams();
    const [commentText, setCommentText] = useState('');
    const [commentList, setCommentList] = useState<string[]>([]);
    const navigation = useNavigation();

    const handleAddComment = () => {
        if (commentText.trim()) {
            setCommentList([commentText, ...commentList]);
            setCommentText('');
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
                            <Text style={styles.commentText}>{item}</Text>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addComment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderColor: '#e1e8ed',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    commentItem: {
        backgroundColor: '#f5f8fa',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    commentText: {
        fontSize: 14,
        color: '#14171A',
    },
    noComments: {
        fontSize: 14,
        color: '#657786',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default PostDetail;
