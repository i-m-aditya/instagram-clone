import React, {useState, useEffect} from 'react';
import './App.css'
import Post from './component/Post'
import { db, auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from '@material-ui/core';
import ImageUpload from './component/ImageUpload'

import InstagramEmbed from 'react-instagram-embed';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


function App() {

  const classes = useStyles()

  const [posts, setposts] = useState([])
  const [open, setopen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('') 
  const [user, setUser] = useState(null)

  const [modalStyle] = React.useState(getModalStyle);

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser)

      }
      else {
        // User has logged out
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup action
      unsubscribe()
    }
  },[user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot)=>{
      
      setposts(
          snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        }))
      )

    })
  })

  const signIn = (event) => {
    event.preventDefault()

    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {alert(error.message)})

    setOpenSignIn(false)
  }

  const signUp = (event) => {
    event.preventDefault() // it prevents page from refreshing

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message))

    setopen(false)

  }
  
  return (
    <div className="app">
      

      <Modal
        open={open}
        onClose={() => setopen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
              <center className="app__modalContainer">
                <img className="app__modalImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>
              <Input type="text" placeholder="Username" value={username} onChange={event => setUsername(event.target.value) }  />
              <Input type="text" placeholder="Email" value={email} onChange={event => setEmail(event.target.value) } />
              <Input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value) } />      
              <Button type="submit" onClick={signUp}>Signup</Button>    
          </form>
          
        </div>
        
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
              <center className="app__modalContainer">
                <img className="app__modalImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/>
              </center>
              <Input type="text" placeholder="Email" value={email} onChange={event => setEmail(event.target.value) } />
              <Input type="password" placeholder="Password" value={password} onChange={event => setPassword(event.target.value) } />      
              <Button type="submit" onClick={signIn}>SignIn</Button>    
          </form>
          
        </div>
        
      </Modal>

      <div className="app__header"> 
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {
            user ? 
                  <Button onClick={()=> auth.signOut()}>Signout</Button>
                : 
                <div>
                  <Button onClick={()=> setOpenSignIn(true)}>Sign-In</Button>
                  <Button onClick={()=> setopen(true)}>Sign-Up</Button>
                </div>
              
        }
        
      </div>

      

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => {
              return (
                <Post
                  key = {id} 
                  postId = {id}
                  user = {user}
                  username = {post.username}
                  imageUrl = {post.imageUrl}
                  caption = {post.caption}
                />
              )
            })
          }
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B8tb_w5HCtW/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />  
        </div>  
      </div>

      {
        (user?.displayName) 
          ? <ImageUpload username={user.displayName}/>
          : <h3>You gotta login to post !!!!</h3>
      }
    </div>
  );
}

export default App;
