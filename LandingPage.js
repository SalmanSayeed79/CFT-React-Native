import React,{useEffect, useState} from 'react'
import { StyleSheet,Image, Text, View, TextInput, Button } from 'react-native';
import {db,auth} from './firebase'

export default function LandingPage({navigation}) {
    const [loggedIn,setLoggedIn]=useState(false)
    const [handle, setHandle]=useState('')
    const [loading,setLoading]=useState(false)
    const getUserInfo =()=>{
        auth.onAuthStateChanged(user=>{
            if (user){
                setLoggedIn(true)
                //accessing db and finding the files and getting the handle
                db.collection(user.email).doc('data').get()
                    .then(res=>{
                        console.log(res.data().handle)
                        setHandle(res.data().handle)
                        
                        setLoading(false)
                        
                    })
              
            }
            else{
                setLoggedIn(false)
             
                
            }
        })  
    }
    useEffect(()=>getUserInfo(),[])


    // const goHome=()=>{
    //     window.setTimeout(()=>{navigation.navigate("Home")},2000)
        
    // }
    // useEffect(()=>goHome(),[])
    
    if(!loggedIn){
        window.setTimeout(()=>{navigation.navigate("Login")},3000)
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('./assets/Logo.png')}/>      
            </View>
        )
    }else{
        window.setTimeout(()=>{navigation.navigate("Home")},3000)
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('./assets/Logo.png')}/>      
            </View>
    )}
}
const styles=StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
    width:150,
    height:179
    },
})