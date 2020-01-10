import React, { useState, useEffect} from 'react';
import "rbx/index.css";
import { Button, Container, Message, Title } from "rbx";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import CourseList from './components/CourseList';
import {timeParts} from './components/course/times';

// FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAn5WHDVmLbdIsQcFYugEWxdwNRTwQTYCg",
  authDomain: "quick-react-tutorial-8eb91.firebaseapp.com",
  databaseURL: "https://quick-react-tutorial-8eb91.firebaseio.com",
  projectId: "quick-react-tutorial-8eb91",
  storageBucket: "quick-react-tutorial-8eb91.appspot.com",
  messagingSenderId: "628870632989",
  appId: "1:628870632989:web:760150bcd91d60a03958f4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

// AUTH UI
const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);




const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

return (
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};

export {db};

export default App;