import { ref } from '../firebase'
import firebase from 'firebase/app';

export function auth (email, pw) {
  return firebase.auth().createUserWithEmailAndPassword(email, pw)
    .then(saveUser)
}

export function logout () {
  return firebase.auth().signOut()
}

export function login (email, pw) {
  return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebase.firebase().sendPasswordResetEmail(email)
}

export function saveUser (user) {
  return ref.child(`users/${user.uid}/info`)
    .set({
      email: user.email,
      uid: user.uid
    })
    .then(() => user)
}