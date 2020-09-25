import React,{useState,useEffect} from 'react'
import {Text,View,StyleSheet, Dimensions,Image,Button,SafeAreaView} from 'react-native'
import {db, auth} from './firebase'



const width=Dimensions.get('window').width
const height=Dimensions.get('window').height





export default function Home({navigation}) {
    const [loading,setLoading]=useState(true)
    const [loggedIn, setLoggedIn]=useState(true)
    const [handle,setHandle]=useState('')
    const [rating, setRating]=useState(0)
    const [rank,setRank]=useState('')
    const [img,setImg]=useState(null)





    //===================================================================
    //
    //  Getting data from the database
    //
    //===================================================================
    const getUserInfo =()=>{
        auth.onAuthStateChanged(user=>{
            if (user){
                setLoggedIn(true)
                //accessing db and finding the files and getting the handle
                db.collection(user.email).doc('data').get()
                    .then(res=>{
                        console.log(res.data().handle)
                        setHandle(res.data().handle)
                        getCFHandleData(res.data().handle)
                        setLoading(false)
                        
                    })
              
            }
            else{
                setLoggedIn(false)
             
                
            }
        })  
    }
    useEffect(()=>getUserInfo(),[])
    
    //getUserInfo()
    //===================================================================
    //
    //  Getting handle info from api
    //
    //===================================================================

    const getCFHandleData=(handle)=>{
        let url=`https://codeforces.com/api/user.info?handles=${handle}`
        fetch(url)
            .then(data=>data.json())
                .then(data=>{
                    //console.log(data)
               
                    let rating=data.result[0].rating
                    let rank=data.result[0].rank

                    setImg(data.result[0].avatar)
                    setRating(rating)
                    setRank(rank)    
                })
                .catch(err=>console.log(err))
         
          
    }
    useEffect(()=>getCFHandleData(),[])

    console.log("homepage")
    if(!loggedIn){
        navigation.navigate('Login')
    }


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.title}><Text style={{color:"white",fontSize:20,fontWeight:'500'}}>My Profile</Text></SafeAreaView>
            <Text>   </Text>
            <Text style={{marginBottom:20,position:"absolute",top:100, color:"grey"}}>Your Personal Details</Text>
            <Image style={styles.image} source={{uri: img}}/>
            <Text>{handle}</Text>
            <Text>{rating}</Text>
            <Text>{rank}</Text>

            <View style={styles.logButton}><Button title="Log Out" color="#FF620A" onPress={()=>auth.signOut()} ></Button></View>
           
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        width:width,
        height:height,
        alignItems:"center",
        justifyContent:"center"
    },
    image:{
        width:width*.4,
        height:width*.4,
        borderRadius:width*.2,
        borderColor:"#FF620A",
        borderWidth:5,
        marginBottom:30
    },
    icon:{
        width:100,
        height:105
    },
    title:{
        backgroundColor:"#FF620A",
        alignItems:"center",
        justifyContent:"center",
        position:"absolute",
        top:0,
        left:0,
        width:width,
        height:90,
    },
    logButton:{
        position:"absolute",
        bottom:height*.1
    }
})
