

import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from "axios";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, query, onSnapshot, serverTimestamp, orderBy, deleteDoc, updateDoc } from "firebase/firestore";
import "./about.css"



const firebaseConfig = {
  apiKey: "AIzaSyDlQ7PohcQ8yp0TFU_11bD1oQvZZdmExfo",
  authDomain: "atten-manager.firebaseapp.com",
  projectId: "atten-manager",
  storageBucket: "atten-manager.appspot.com",
  messagingSenderId: "1039776433169",
  appId: "1:1039776433169:web:36a803bfbdde85ee489db0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



function About() {



  const [postText, setpostText] = useState("");
  const [post, setpost] = useState([]);
  const [file, setFile] = useState(null);

  const [Name, setName] = useState("");
  const [FatherName, setFatherName] = useState("");
  const [RollNo, setRollNO] = useState("");
  const [ContactNum, setcontactNum] = useState("");
  const [CnicNum, setCnicNum] = useState("");
  const [CourseName, setCourseName] = useState("");











  const [Editing, setEditing] = useState({
    editingId: null,
    editingText: " "
  })


  const formik = useFormik({
    initialValues: {
      text: ""
    },
    validationSchema: yup.object({
      text: yup
        .string('Enter Title')
        .required('Title is required'),
    }),
    onSubmit: async (values) => {

      const cloudinaryData = new FormData();
      cloudinaryData.append("file", file);
      cloudinaryData.append("upload_preset", "uploadedPic");
      cloudinaryData.append("cloud_name", "diq617ttx");
      console.log(cloudinaryData);


      axios.post(` https://api.cloudinary.com/v1_1/diq617ttx/image/upload`, cloudinaryData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(async res => {

          console.log("from then", res.data);

          console.log("values", values)
          try {
            const docRef = await addDoc(collection(db, "post"), {
              text: values.text,
              Name: values.Name,
              FatherName: values.FatherName,
              img: res?.data?.url,
              createdOn: serverTimestamp()

            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        })
        .catch(err => {
          console.log("from catch", err);
        })




    },
  });






  useEffect(() => {
    //ONE TIME READ DATA
    // const getData = async () => {
    //   const querySnapshot = await getDocs(collection(db, "post"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => `, doc.data());


    //     setposts((prev) => {
    //       //Array clonning

    //       let newArray = [...prev, doc.data()];

    //       return newArray
    //     });

    //   });
    // }
    // getData();



    //REAL TIME DATA 
    let unsubscribe = null
    const getRealTimeData = () => {

      const q = query(collection(db, "post"), orderBy("createdOn", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const post = [];
        querySnapshot.forEach((doc) => {
          // post.push(doc.data());

          let data = doc.data()
          data.id = doc.id

          post.push(data);

        });

        setpost(post);
        console.log("post:",post);

      });
    }
    getRealTimeData();

    //CLEAN UP FUNCTION  
    return () => {
      console.log("Clean up function")
      unsubscribe();
    }

  }, [])





  const savePost = async (e) => {
    e.preventDefault();

    console.log("posttext: ", postText)
    //ADD DATA
    try {
      const docRef = await addDoc(collection(db, "post"), {
        text: postText,
        Name: Name,
        FatherName: FatherName,
        RollNo: RollNo,
        ContactNum: ContactNum,
        CnicNum: CnicNum,
        CourseName: CourseName,
        createdOn: serverTimestamp()

      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }


  }

  const deletePost = async (postId) => {

    console.log("postid", postId)

    await deleteDoc(doc(db, "post", postId));

  }

  const updatePost = async (e) => {

    e.preventDefault();

    await updateDoc(doc(db, "post", Editing.editingId), {
      text: Editing.editingText
    });

    setEditing({
      editingId: null,
      editingText: ""
    })

  }


  // const edit = (postId,text) => {

  //   const updateState =
  //     post.map(eachItem => {
  //       if (eachItem.id === postId) {
  //         return { ...eachItem, IsEditing: !eachItem.IsEditing }
  //       }
  //       else {
  //         return eachItem
  //       }
  //     })

  //   setposts(updateState)
  // }


  return (

    <div >

      <div className='head '>

        <form className='studentForm' onSubmit={savePost} >
        <h1>STUDENT DATA </h1>

        {/* onSubmit={formik.handleSubmit} */}
         
          <input className="classAssign" type="text" placeholder="Enter Name" onChange={(e) => { setName(e.target.value) }}></input>
          <br />
          <input className="classAssign" type="text" placeholder="Enter Father Name" onChange={(e) => { setFatherName(e.target.value) }}></input>
          <br />
          <input className="classAssign" type="number" placeholder="Enter Roll no" onChange={(e) => { setRollNO(e.target.value) }}></input>
          <br />
          <input className="classAssign" type="number" placeholder="Enter Contact Number" onChange={(e) => { setcontactNum(e.target.value) }}></input>
          <br />
          <input className="classAssign" type="number" placeholder="Enter CNIC number" onChange={(e) => { setCnicNum(e.target.value) }}></input>
          <br />
          <input className="classAssign" type="text" placeholder="Enter Course Name" onChange={(e) => { setCourseName(e.target.value) }}></input>
          <br />


          {/* upload photo */}
          <input
          className="classAssign"
            type="file"
            name="uploadedPic"
            onChange={(e) => {
              setFile(e.currentTarget.files[0])
            }}>
          </input>
          <br />

          <button  className="classButtonStudent" type="submit">POST</button>
        </form>
      </div>

      <h2>STUDENT DATA: </h2>
      
      <div className='mainPost'>

     


        {post.map((eachPost, i) => (
          <div className='post' key={i}>



            <p>Name: {eachPost?.Name} </p>
            <p>Father Name: {eachPost?.FatherName} </p>
            <p>Roll no: {eachPost?.RollNo} </p>
            <p>Contact number: {eachPost?.ContactNum} </p>
            <p>CNIC number: {eachPost?.CnicNum} </p>
            <p>Course Name: {eachPost?.Course} </p>



            <h3>{(eachPost.id == Editing.editingId) ?

              <form onSubmit={updatePost}>

                <input type="text"
                  value={Editing.editingText}
                  onChange={(e) => {
                    setEditing({
                      ...Editing,
                      editingText: e.target.value
                    })
                  }}
                  placeholder="Please enter updated value" />

                <button type='Submit' >Update</button>

              </form>
              : eachPost?.text}
            </h3>




            {/*      terniray operator */}
            <span>{moment((eachPost?.createdOn?.seconds * 1000) ? eachPost?.createdOn?.seconds * 1000
              :
              undefined)
              .format('Do MMMM  YYYY, h:mm a')}</span>

            <img src={eachPost?.img} alt=""></img>

            <br />
            <br />



            {/* Delete button */}
            <button  className="classButton" onClick={() => {
              deletePost(eachPost?.id)
            }}>
              Delete</button>


            {/* edit button */}
            {(Editing.editingId === eachPost?.id) ? null :
              <button  className="classButton"
                onClick={() => {
                  setEditing({
                    ...Editing,
                    editingId: eachPost?.id,
                    editingText: eachPost?.text
                  })
                }}
              >Edit </button>

            }


          </div>
        ))}

      </div>

    </div >
  );
}

export default About;