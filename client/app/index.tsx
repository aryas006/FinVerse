import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import BottomNav from './Components/BottomNav';

const Index = () => {
    const id = "d4e0884c-e8e3-4dc3-85f2-25f4c02b562f";
    return (
        <View style={styles.container}>
            <Link href={'/auth/Login'} style={{ fontSize: 40, fontFamily: 'monospace' }}>
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


