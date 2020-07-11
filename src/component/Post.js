/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import './Post.css'

import { Input , Button} from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';
import { useState, useEffect } from 'react';
import { db } from '../firebase';

import firebase from 'firebase'

function Post({ postId, username, user, imageUrl, caption}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    }, [postId])


    const postComment = (event) => {

        event.preventDefault()


        db.collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        

            setComment('')
        
    }

    return (
        <div className="post">

            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username} 
                    src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>
            {/* {header -> avatar + username} */}
            <img className="post__image" src={imageUrl}></img>
            {/* image */}

            <h4 className="post__text"> <strong>{username}: </strong>{caption}</h4>
            {/* username + caption  */}

            {/* Add comments */}

            {comments.length !== 0 &&
                <div className="post__comments">
                    {
                        comments.map((comment) => (
                            <p>
                                <b>{comment.username}: </b>
                                {comment.text}
                            </p>
                        ))
                    }   
                </div>
            }

            {
                user &&

                <form className="post__commentBox">
                    <Input 
                        className="post__input"
                        type="text"
                        placeholder="Add a comment ..."
                        value={comment}
                        onChange = {(e) => setComment(e.target.value)}

                    />
                    <Button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                        color="primary"
                        variant="outlined"
                    > 
                        Post
                    </Button>
                </form>

            }

            
        </div>
    )
}

export default Post
