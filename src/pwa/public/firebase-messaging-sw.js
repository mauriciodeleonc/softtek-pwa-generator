importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
const firebaseConfig = {
     apiKey: "AIzaSyB3LgUOwBxVZp8GJHu1e3i_PtxPT2fQo-E",
     authDomain: "softtek-pwa.firebaseapp.com",
     projectId: "softtek-pwa",
     storageBucket: "softtek-pwa.appspot.com",
     messagingSenderId: "251294119375",
     appId: "1:251294119375:web:eac0c511f1938253644eba",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
     const promiseChain = clients
          .matchAll({
               type: "window",
               includeUncontrolled: true,
          })
          .then((windowClients) => {
               for (let i = 0; i < windowClients.length; i++) {
                    const windowClient = windowClients[i];
                    windowClient.postMessage(payload);
               }
          })
          .then(() => {
               return registration.showNotification("my notification title");
          });
     return promiseChain;
});
self.addEventListener("notificationclick", function(event) {
     console.log(event);
});