import React ,{useState,useEffect}from 'react'
import {Text,View,StyleSheet,ScrollView,Dimensions,TouchableOpacity,Button, SafeAreaView} from 'react-native'
import {db,auth} from './firebase'
import * as Linking from 'expo-linking';
import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
//import { MaterialIcons } from '@expo/vector-icons'; 
import { TextInput } from 'react-native-gesture-handler';
//import { TouchableOpacity } from 'react-native-gesture-handler'
//import { ScrollView } from 'react-native-gesture-handler'


const width=Dimensions.get("window").width
const height=Dimensions.get('window').height

export default function AddProblem({navigation}) {
    
    
    const [loading,setLoading]=useState(false)
    const [problems,setProblems]=useState([])
    const [loggedIn, setLoggedIn]=useState(true)
    const [handleT,setHandleT]=useState('')
    const [number, setNumber]=useState(10)
    const [email,setEmail]=useState('')


    //=====================================================================
    //
    //  Checking if logged in
    //
    //=====================================================================
    const isLoggedIn=()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                setLoggedIn(true)
                setEmail(user.email)
            }
            else{
                alert("Please login")
                setLoggedIn(false)
            }
        })
    }


    
    //====================================================================
    //
    //  Getting user data
    //
    //====================================================================
    //creating a list to put all the data in
    let listed=[]
    const getSubmissions=()=>{
        console.log("function ran")
       setLoading(true)
        

        // console.log(handleT)
        // console.log(number)


        let url=`https://codeforces.com/api/user.status?handle=${handleT}&from=1&count=${number}`
        fetch(url)
            .then((res)=>res.json())
            .then((data)=>{
                //console.log(data.result)
                
            data.result.forEach(a=>{
                if(a.verdict==='OK'){
                    listed.push(a)}
            })
            })
            .then(()=>{
                console.log(listed)
                setProblems(listed)
                setLoading(false)
                
            })
            .catch(()=>{
                alert('Please enter a correct handle')
                window.location.reload()
            })

            }
            //Adding data to the firebase

            const addDataFirebase=(data)=>{
                console.log(data)
                let docName=data.problem.contestId+data.problem.index
                let rating=(data.problem.rating? data.problem.rating : '')
                console.log('user Data fetched')
                db.collection(email).doc('data').collection('problems').doc(docName).set({
                    contest_id:data.problem.contestId,
                    name:data.problem.name,
                    prob_id:data.problem.index,
                    rating:rating,
                    url:`http://codeforces.com/problemset/problem/${data.problem.contestId}/${data.problem.index}`
                })
                console.log('data added')
                alert("Problem Added")
            }
    

    useEffect(()=>isLoggedIn(),[])
    
    if(loading){
        return(<View style={{height:height, width:width, alignItems:"center",justifyContent:"center"}}><Text>Loading.........</Text></View>)
    }
    if(!loggedIn){
        navigation.navigate("Login")
        return 0
    }else{
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.title}><Text style={{fontSize:20,color:"white", fontWeight:'500'}}>Track Users</Text></SafeAreaView>
            <Text style={{marginBottom:20, color:"grey"}}>See the latest AC problems of your friends</Text>
            <TextInput style={styles.input} placeholder="Target Handle" onChangeText={a=>setHandleT(a)}></TextInput>
            <TextInput style={styles.input} placeholder="Submission Number" onChangeText={a=>setNumber(a)}></TextInput>
            <View style={styles.searchButton}><Button color="#FF620A"  onPress={()=>getSubmissions()} title="Search"></Button></View>
            {/*<AntDesign name="search1" size={24} color="white" />*/}
            <ScrollView style={{height:height*.6}} >

                {console.log(problems)}
                {problems.map(a=>(
                    <TouchableOpacity onPress={()=>Linking.openURL(`https://codeforces.com/problemset/problem/${a.problem.contestId}/${a.problem.index}`)} style={styles.button}>
                        
                        <Text style={styles.name}>{a.problem.name}</Text>
                        <Text  style={styles.rating}>{a.problem.rating}</Text>
                        <Text style={styles.id}>{a.problem.contestId+a.problem.index}</Text>
                        <Button  title="Add" color="#FF620A" style={styles.delete} onPress={()=>addDataFirebase(a)}></Button>
                        {/*<Ionicons name="md-add" size={24} color="white" />*/}
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
        marginVertical:10
        
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