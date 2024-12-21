import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import BottomNav from './Components/BottomNav';

const Index = () => {
    return (
        <View style={styles.container}>
            <Link href="/auth/Login" style={{ fontSize: 40, fontFamily: 'monospace' }}>
                {"{finverse}"}
            </Link>

        </View>
    );
}

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
