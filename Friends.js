import React ,{useState,useEffect}from 'react'
import {Text,View,StyleSheet,ScrollView,Dimensions,TouchableOpacity,Button, TextInput,SafeAreaView,RefreshControl} from 'react-native'
import {db,auth} from './firebase'
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons'; 




const width=Dimensions.get("window").width
const height=Dimensions.get('window').height

export default function Friends({navigation}) {
    const [loading,setLoading]=useState(false)
    const [loggedIn, setLoggedIn]=useState(true)
    const [userId,setUserId]=useState(null)
    const [friends,setFriends]=useState([])
    const[newFriend,setNewFriend]=useState('')
    let listedFriends=[]
    //getting user info
    const userInfo=()=>{
        setLoading(true)
        setLoggedIn(true)
        auth.onAuthStateChanged(user=>{
        if(user){
            setUserId(user.email)
            //  Getting friends from my database
            db.collection(user.email).doc('data').collection('friends').get()
            .then(data=>{
                data.docs.forEach(a=>{
                    console.log(a.data())
                    listedFriends.push(a.data())

                }
                )
            }).then(()=>{ setFriends(listedFriends)})
            .then(()=>{
                setLoading(false)
                
            })
            
        }else{
            alert ('Please Login first')
            setLoggedIn(false)
        }
        })
    }
    //adding new friend
    const addFriend=()=>{
        
        db.collection(userId).doc('data').collection('friends').doc(newFriend).set({
            handle:newFriend
        })
        userInfo()
    }
    useEffect(()=>{
         userInfo()
    },[])

    
 


    if(loading){
        return(<View style={{height:height, width:width, alignItems:"center",justifyContent:"center"}}><Text>Loading.........</Text></View>)
    }if(!loggedIn){
        navigation.navigate("Login")
        return 0
    }else{
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.title}><Text style={{fontSize:20,color:"white", fontWeight:'500'}}>Friends</Text></SafeAreaView>
            <Text style={{marginBottom:20, color:"grey"}}>Track all your friends in one place</Text>
            <TextInput style={styles.input} placeholder="Friend's Handle"  onChangeText={a=>setNewFriend(a)}></TextInput>
            <View style={styles.searchButton}><Button color="#FF620A"  onPress={()=>addFriend()} title="Add Friend"></Button></View>
            <ScrollView style={{height:height*.7}}   >

                {console.log(friends)}
                {friends.map(a=>(
                    <TouchableOpacity onPress={()=>Linking.openURL(`https://codeforces.com/profile/${a.handle}`)} style={styles.button}>
                        <Text style={styles.name}>{a.handle}</Text>
                    </TouchableOpacity>))}
            </ScrollView>
        </View>
    )}
}

const styles=StyleSheet.create({
    title:{
        
        backgroundColor:"#FF620A",
        width:width,
        height:90,
        marginBottom:30,
       textAlign:"center",
       alignItems:"center",
       justifyContent:"center"
    },
    container:{
        width:width,
        height:height,
        alignItems:"center",
        justifyContent:"center"
    },
    input:{
        width: width*.7,
        height: height*.05,
        textAlign:"center",
        borderBottomColor:"#FF620A",
        borderBottomWidth:1,
        marginBottom:3
    },
    searchButton:{
        width:width*.5,
        marginTop:5,
        marginVertical:10,
        marginBottom:30
        
    },
    listItem:{
        width:width*.97,
        height:100,
        borderWidth:1,
        borderColor:"grey",
        backgroundColor:"lightpink"
    },
    scrollView:{
        alignItems:"center",
        justifyContent:"center",
        width:width,
    
    },
    button: {
        alignItems: "center",
        justifyContent:"center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        flexDirection:"row",
        marginBottom:10,
        minHeight:70,
        width:width*.9
      },

    name:{
        width:width*.8,
        marginRight:5,
        textAlign:"center"
    },

})