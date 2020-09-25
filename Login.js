import React,{useState,useEffect} from 'react'

import {Text,View,StyleSheet, Button, Dimensions,Image} from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import {db, auth} from './firebase'

const width=Dimensions.get("window").width
const height=Dimensions.get('window').height




export default function Login({navigation}) {

    const [email,setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [name, setName]=useState('')
    const [loading,setLoading]=useState(false)
    const [loggedIn, setLoggedIn]=useState(false)



    const getUserInfo =()=>{
        console.log("user info")
        auth.onAuthStateChanged(user=>{
            if (user){
                setLoggedIn(true)
                //accessing db and finding the files and getting the handle
                // db.collection(user.email).doc('data').get()
                //     .then(res=>{
                //         console.log(res.data().handle)
                //         //setHandle(res.data().handle)
                //         getCFHandleData(res.data().handle)
                //         setLoading(false)
                        
                //     })
              
            }
            else{
                setLoggedIn(false)
             
                
            }
        })  
    }


    const createUser=()=>{
        // let name=nameRef.current.value
        // let email=emailRef.current.value
        // let pass=passwordRef.current.value

        //alert (name)
        auth.createUserWithEmailAndPassword(email,password)
        //console.log('user created')

        //creating the firebase for the new user
        db.collection(email).doc('data').set({
            handle:name,
        }).then(()=>{navigation.navigate('Home')})
        .catch(err=>alert(err))
        //alert('New user created')
        


        // alert(name)
        // alert(email)
        // alert(password)
    }
    const login=()=>{
        // let email=email
        // let pass=password

        auth.signInWithEmailAndPassword(email,password)
        //
        //alert('user logged in')
        //.catch((err)=>{alert(err)})
        .then(()=>getUserInfo())
        .catch((err)=>alert(err))
        //.then(()=> navigation.navigate('Home'))
        //alert('New user loggedin')
       
        // alert(email)
        // alert(password)
    
    }
    console.log(loggedIn)


    useEffect(()=>getUserInfo(),[])

    if(loggedIn){
        navigation.navigate("Home",{loggedIn:loggedIn})
        return null
    }else{

    return (
        <View style={loginStyle.container}>
        <Image style={loginStyle.image} source={require('./assets/Logo.png')}/>  
       

            <View style={loginStyle.inputContainer}>
                <ScrollView>
                    <TextInput style={loginStyle.input}  placeholder="Handle Name" onChangeText={(a)=>setName(a)} value={name}/>
                    <TextInput style={loginStyle.input} autoCompleteType="email"  placeholder="Email" onChangeText={(a)=>setEmail(a)} value={email}/>
                    <TextInput style={loginStyle.input} secureTextEntry={true}  placeholder="Password" onChangeText={(a)=>setPassword(a)} value={password}/>
                    <Text>    </Text>
                    <Button title="Create Account" color="#FF620A" style={loginStyle.button} onPress={createUser}/>
                    <Text>    </Text>
                    <Button title="Login" color="#FF620A" style={loginStyle.button} onPress={login}/>
                </ScrollView>
            </View>
        </View>
    )}

}

//defining styles
const loginStyle=StyleSheet.create({
    
    title:{
        fontSize:25,
        color:"#FF620A",
        backgroundColor:"#FF620A",
        padding:3,
        paddingHorizontal:20,
        borderRadius:10


    },
    input:{
        width: width*.7,
        height: height*.05,
        textAlign:"center",
        borderBottomColor:"#FF620A",
        borderBottomWidth:1,
        marginBottom:3
    },
    container:{
        width:width,
        height: height,
        alignItems:"center",
        //justifyContent:"center",
        marginTop:height*.2

    },
    image:{
        width:150,
        height:179
    },
    button:{
        width:width*.2,
        marginTop:5,
        
    },
    inputContainer:{
        marginTop:height*.1
    }
})

