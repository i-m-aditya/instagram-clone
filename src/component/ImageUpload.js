import React, {useState} from 'react'
import {Button} from '@material-ui/core';
import firebase from 'firebase'
import {db, storage} from '../firebase'
import './ImageUpload.css'

function ImageUpload({username}) {


    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)
    

    const handleChange = (e) => {
        // console.log("handle change: ",e.target.files);
        setImage(e.target.files[0])
    }

    const handleUpload = () => {

        const uploadTask = storage.ref(`images/${image.name}`).put(image)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                alert(error.message)
                console.log(error.message)
            },
            () => {
                // Complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username

                        })

                        setCaption('')
                        setProgress(0)
                        setImage(null)
                    })
            }

        )

    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input 
                type="text"
                placeholder="Enter a caption ..."
                value={caption}
                onChange={(event) => setCaption(event.target.value) }
                />
            <input type="file" onChange={handleChange} /> 
            <Button size="small" onClick={handleUpload}> Upload </Button> 
        </div>
    )
}

export default ImageUpload
