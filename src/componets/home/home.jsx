import { useState, useEffect } from "react";
import moment from 'moment';

import {
    getFirestore, collection,
    addDoc, getDocs, doc,
    onSnapshot, query, serverTimestamp,
    orderBy, deleteDoc, updateDoc, where

} from "firebase/firestore";

import { getAuth } from 'firebase/auth'
import "./home.css"




function Home() {

    const db = getFirestore();


    // const [postText, setPostText] = useState("");
    const [ClassTiming, setClassTiming] = useState("");
    const [ScheduleClass, setScheduleClass] = useState("");
    const [TeacherName, setTeacherName] = useState("");
    const [SectionName, setSectionName] = useState("");
    const [CourseName, setCourseName] = useState("");
    const [BatchNum, setBatchNum] = useState("");

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [editing, setEditing] = useState({
        editingId: null,
        editingText: "",
        editingClasstiming:""
    })




    useEffect(() => {

        const auth = getAuth();

        let unsubscribe = null;
        const getRealtimeData = async () => {

            const q = query(
                collection(db, "posts"),
                where("user", "==", auth.currentUser.email),
                // orderBy("user")
            );

            console.log("===========>", auth.currentUser.email);

            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const posts = [];

                querySnapshot.forEach((doc) => {
                    // posts.unshift(doc.data());
                    // posts.push(doc.data());

                    posts.push({ id: doc.id, ...doc.data() });

                });

                setPosts(posts);
                console.log("posts: ", posts);
            });

        }
        getRealtimeData();

        return () => {
            console.log("Cleanup function");
            unsubscribe();
        }

    }, [])




    const savePost = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        // console.log("postText: ", postText);

        try {

            const docRef = await addDoc(collection(db, "posts"), {
                // text: postText,
                user: auth.currentUser.email,
                ClassTiming: ClassTiming,
                ScheduleClass: ScheduleClass,
                TeacherName: TeacherName,
                SectionName: SectionName,
                CourseName: CourseName,
                BatchNum: BatchNum,
                // createdOn: new Date().getTime(),
                createdOn: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);

        } catch (e) {
            console.error("Error adding document: ", e);
        }


    }
    console.log( "POSTS",posts)

    const deletePost = async (postId) => {

        console.log("postId: ", postId);

        await deleteDoc(doc(db, "posts", postId));

    }

    const updatePost = async (e) => {
        e.preventDefault();

        await updateDoc(doc(db, "posts", editing.editingId), {
            text: editing.editingText,
            ClassTiming: editing.editingClasstiming
           
        });

        setEditing({
            editingId: null,
            editingText: "",
            editingClasstiming:""
           
        })

    }


    return (
        <div>
            <div className="classInputDiv">
                <form className="classInput" onSubmit={savePost}>
                    <h1>CLASS ASSIGNING </h1>
                    {/* <textarea
                    type="text"
                    placeholder="What's in your mind..."
                    onChange={(e) => { setPostText(e.target.value) }} /> */}
                    <br />
                    <input className="classAssign" type="number" placeholder="Enter Class timing" onChange={(e) => { setClassTiming(e.target.value) }}></input>
                    <br />
                    <input className="classAssign" type="text" placeholder="Enter Schedule of Class" onChange={(e) => { setScheduleClass(e.target.value) }}></input>
                    <br />
                    <input className="classAssign" type="text" placeholder="Enter Teacher's Name" onChange={(e) => { setTeacherName(e.target.value) }}></input>
                    <br />
                    <input className="classAssign" type="text" placeholder="Enter Section Name" onChange={(e) => { setSectionName(e.target.value) }}></input>
                    <br />
                    <input className="classAssign" type="text" placeholder="Enter Course Name" onChange={(e) => { setCourseName(e.target.value) }}></input>
                    <br />
                    <input className="classAssign" type="number" placeholder="Enter Batch Number" onChange={(e) => { setBatchNum(e.target.value) }}></input>
                    <br />
                    <button className="classButtonStudent" type="submit">Post</button>
                </form>
            </div>

            <h2>CLASS DATA: </h2>

            <div className='mainPost' >
                {(isLoading) ? "loading..." : ""}

                {posts.map((eachPost, i) => (
                    <div className="post" key={i}>
                        
                        <div  >
                        <p>Batch Name: {eachPost?.BatchNum} </p>
                        <p>Class Timing: {eachPost?.ClassTiming} </p>
                        <p>Schedule Class: {eachPost?.ScheduleClass} </p>
                        <p>Course Name: {eachPost?.CourseName} </p>
                        <p>Section Name: {eachPost?.SectionName} </p>
                        <p>Teacher Name: {eachPost?.TeacherName} </p>
                        </div>
                        

                        <p
                            className="title" href={eachPost?.url} target="_blank" rel="noreferrer"
                        >
                            {(eachPost.id === editing.editingId) ?
                                <form onSubmit={updatePost}>

                                    <input
                                        type="text"
                                        value={editing.editingText}
                                        onChange={(e) => {
                                            setEditing({
                                                ...editing,
                                                editingText: e.target.value,
                                                editingClasstiming: e.target.value
                                            })
                                        }}
                                        
                                        placeholder="please enter updated value" />

                                    <button type="submit">Update</button>
                                </form>
                                :
                                eachPost?.text
                            }
                        </p>

                        <span>{
                            moment(
                                (eachPost?.createdOn?.seconds) ?
                                    eachPost?.createdOn?.seconds * 1000
                                    :
                                    undefined
                            )
                                .format('Do MMMM, h:mm a')
                        }</span>

                        <br />
                        <br />
                        <button className="classButton" onClick={() => {

                            deletePost(eachPost?.id)

                        }}>Delete</button>

                        {(editing.editingId === eachPost?.id) ? null :
                            <button className="classButton" onClick={() => {

                                setEditing({
                                    editingId: eachPost?.id,
                                    editingText: eachPost?.text,
                                  
                                })
                                

                            }} >Edit</button>
                        }

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Home;
