import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,ImageBackground,StatusBar,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
const HEIGHT = Dimensions.get("window").height + StatusBar.currentHeight;

const LoginScreen = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            navigation.navigate("UserList")
            Alert.alert('Login Successful', `Welcome, ${email}!`);
        } else {
            Alert.alert('Error', 'Please enter both email and password.');
        }
    };

    return (
        <ImageBackground source={require('./Assets/BgImage.png')} style={styles.backgroundImage} resizeMode='cover' resizeMethod="resize">
        <StatusBar
            backgroundColor="transparent"
            translucent={true}
        />
        <View style={styles.container}>
            <Text style={styles.title}>Enter the username and password to view the userlist</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={'#fff'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={'#fff'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <Button title="Login" onPress={handleLogin} />
        </View>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff'
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 15,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: HEIGHT,
    },
});

export default LoginScreen;
