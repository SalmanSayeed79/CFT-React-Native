import React ,{useState,useEffect}from 'react'
import {Text,View,StyleSheet,ScrollView,Dimensions,TouchableOpacity,Button, SafeAreaView,RefreshControl} from 'react-native'
import {db,auth} from './firebase'
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons'; 
//import { TouchableOpacity } from 'react-native-gesture-handler'
//import { ScrollView } from 'react-native-gesture-handler'
import Constants from 'expo-constants';


const width=Dimensions.get("window").width
const height=Dimensions.get('window').height




export default function Saved({navigation}) {
    const[userId,setUserId]=useState(null)
    const [loading,setLoading]=useState(true)
    const [loggedIn, setLoggedIn]=useState(false)
    const [problemList, setProblemList]=useState([])
    const [email,setEmail]=useState('')
    let problemlist=[]
    let[refresh,setRefresh]=useState(0)

    //===================================================================
    //
    //  Getting data from the database
    //
    //===================================================================
    const getUserInfo =()=>{
        auth.onAuthStateChanged(user=>{
            if (user){
                setUserId(user)
                setLoggedIn(true)
                setEmail(user.email)
                //accessing db and finding the files and getting the handle
                db.collection(user.email).doc('data').collection('problems').get()
                    .then(res=>{
                        res.docs.forEach(a=>{
                            console.log(a.data())
                            problemlist.push(a.data())  
                        })
                    })
                    .then(()=>{
                        setLoading(false)
                        setProblemList(problemlist)
                        console.log(problemlist)

                    })
                
                
                
            }
            else{
                alert('Login please!')
                setLoggedIn(false)
            }
        })  
    }
    useEffect(()=>getUserInfo(),[refresh])
    
    //===================================================================
    //
    //  Adding problem to the database
    //
    //===================================================================
    const addProblem=()=>{
        let ct_id=document.querySelector('#ct_id').value
        let prb_id=document.querySelector('#prb_id').value
        let rating=document.querySelector('#rating').value
        let prb_name=document.querySelector('#prb-name').value
        let doc_name=ct_id+prb_id

        //saving the data to firebase
        db.collection(userId.email).doc('data').collection('problems').doc(doc_name).set({
            name:prb_name,
            contest_id:ct_id,
            prob_id:prb_id,
            rating:rating,
            url:`http://codeforces.com/problemset/problem/${ct_id}/${prb_id}`

        })
        //re-running the data fetching
        getUserInfo()
        //clearing the input fields
        
    }
       
    const removeData=(data)=>{
        db.collection(email).doc('data').collection('problems').doc(data.contest_id + data.prob_id).delete()
        .then(()=>setRefresh(a=>a+=1))
        
    }


    if(loading){
        return(
            <View style={{height:height, width:width, alignItems:"center",justifyContent:"center"}}><Text>Loading.........</Text></View>
            
        )
    }else{
    return (
        <View style={styles.container}>
            
        <SafeAreaView style={styles.title}><Text style={{fontSize:20,color:"white", fontWeight:'500'}}>Saved Page</Text></SafeAreaView>
            <Text style={{marginBottom:20, color:"grey"}}>All your saved problems are stored here</Text>
            <View style={styles.scrollView}>
            <ScrollView style={{height:height*.7}}   >
            {/*Refresh functionality*/}
            





            {/*Main part*/}
                {console.log(problemList)}
                {problemList.map(a=>(
                    <TouchableOpacity onPress={()=>Linking.openURL(a.url)} style={styles.button}>
                        
                        <Text style={styles.id}>{a.contest_id+a.prob_id}</Text>
                        <Text  style={styles.name}>{a.name}</Text>
                        <Text style={styles.rating}>{a.rating}</Text>
                        <Button onPress={()=>removeData(a)} title="Delete" color="#FF620A" style={styles.delete} ></Button>
                        {/*<MaterialIcons name="delete" size={24} color="white" /> */}
                    </TouchableOpacity>))}
            </ScrollView>
            <Text style={styles.refreshButton} onPress={()=>getUserInfo()}>Refresh</Text>
            </View>
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
        alignItems:"center",
        justifyContent:"center"
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
        minHeight:70
      },
    refreshButton:{
        alignItems: "center",
        justifyContent:"center",
        backgroundColor: "#FF620A",
        color:"white",
        padding: 10,
        flexDirection:"row",
        
        
    },
    rating:{
        width:width*.1,
        marginRight:5
    },
    id:{
        width:width*.2,
        marginRight:5
    },
    name:{
        width:width*.4,
        marginRight:5
    },
    delete:{
        backgroundColor:'#FF620A',
        color:"#FF620A",
        borderRadius:12,
        padding:5,
        zIndex:1
    }
})