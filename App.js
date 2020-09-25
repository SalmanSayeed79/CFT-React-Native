import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet,Image, Text, View, TextInput,Dimensions } from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from "@react-navigation/stack"

import LandingPage from './LandingPage'
import Home from "./home"
import Login from './Login'
import Track from './Track'
import Saved from './Saved'
import Friends from './Friends'
import AddProblem from './AddProblem'



import { MaterialCommunityIcons } from '@expo/vector-icons';


const HStack=createStackNavigator()
const Drawer=createDrawerNavigator()
const Tab=createBottomTabNavigator()
const width=Dimensions.get("window").width

// function HomeStack(){
//   return(

    

//   )
// }






function TabStack(){

  return(
  <Tab.Navigator initialRouteName="My Profile"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = (focused? 'home-outline' : 'home');
        } else if (route.name === 'Saved') {
          iconName = focused ? 'content-save-outline' : 'content-save-outline';
        }else if (route.name === 'Track') {
          iconName = focused ? 'apple-safari' : 'apple-safari';
        }else if (route.name === 'Friends') {
          iconName = focused ? 'account-group' : 'account-group';
        }else if (route.name === 'My Profile') {
          iconName = focused ? 'account' : 'account';
        }
        // You can return any component that you like here!
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#FF620A',
      inactiveTintColor: 'gray',
    }}
    
  
  >
    <Tab.Screen name="Saved" component={Saved}/>
    <Tab.Screen name="Track" component={Track}/>
    <Tab.Screen name="Friends" component={Friends}/>
    <Tab.Screen name="My Profile" component={Home}/>
  </Tab.Navigator>
  )}


export default function App() {

  return (
    <NavigationContainer>
    <HStack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
      <HStack.Screen name="Landing" component={LandingPage}/>
      <HStack.Screen name="Home" component={TabStack}/>
      <HStack.Screen name="Login" component={Login}/>
    </HStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    width:150,
    height:179
  }
});

