import React, { useContext, useState, useEffect } from 'react'
import { auth, db, messaging } from '../firebase';
import firebase from 'firebase/app';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true)

    async function signup(email, password) {
        try {
            const user = await auth.createUserWithEmailAndPassword(email, password);
            const token = await messaging.getToken(); //
            const userData = {
                id: user.user.uid,
                isUser: true,
                mail: user.user.email,
                name: null,
                phoneNumber: null,
                token, //
            }
            const userExists = await db.collection('users').doc(userData.id).get();
            if (!userExists.exists) {
                //create new user
                await db.collection('users').doc(userData.id).set(Object.assign({}, userData));
                //create empty cart for user
                return await db.collection('carts').doc().set({
                    noProducts: 0,
                    restaurantes: [],
                    total: 0,
                    userId: userData.id,
                    waitingTime: 0
                })
            }
        } catch (err) {
            throw err;
        }
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    async function loginWithGoogle() {
        try {
            const googleProvider = new firebase.auth.GoogleAuthProvider();
            const user = await auth.signInWithPopup(googleProvider);
            const token = await messaging.getToken(); //
            const userData = {
                id: user.user.uid,
                isUser: true,
                mail: user.user.email,
                name: user.user.displayName,
                phoneNumber: user.user.phoneNumber ? user.user.phoneNumber : null,
                token, //
            }
            const userExists = await db.collection('users').doc(userData.id).get();
            if (!userExists.exists) {
                //create new user
                await db.collection('users').doc(userData.id).set(Object.assign({}, userData));
                //create empty cart for user
                return await db.collection('carts').doc().set({
                    noProducts: 0,
                    restaurantes: [],
                    total: 0,
                    userId: userData.id,
                    waitingTime: 0
                })

            }
        } catch (err) {
            throw err
        }
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
