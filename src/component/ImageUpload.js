import React, {useState} from 'react'
import {Button, Input, LinearProgress} from '@material-ui/core';
import firebase from 'firebase'
import {db, storage} from '../firebase'
import './ImageUpload.css'

function ImageUpload({username, afterUpload}) {


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
                        afterUpload()
                        console.log("Image Uploaded successfully !!!");
                    })
            }

        )

    }

    return (

        <div className="imageupload">
            <LinearProgress variant="buffer" value={progress} valueBuffer={100} />
            <Input 
                type="text"
                placeholder="Enter a caption ..."
                value={caption}
                onChange={(event) => setCaption(event.target.value) }
                />
            <Input className="imageUpload__file" type="file" onChange={handleChange} /> 
            <Button 
                onClick={handleUpload}
                variant="contained" color="secondary"
            > 
                Upload
            </Button> 
        </div>
    )
}

export default ImageUpload
