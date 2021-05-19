const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const statusStrings = ["Recibida", "En Proceso", "Por Entregar", "Entregada", "Cancelada"]

exports.changeStatusNotification = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((change, context) => {
        const oldDocument = change.before.data();
        const newDocument = change.after.data();

        if (oldDocument.statusId === newDocument.statusId)
            return false;
                   
        let db = admin.firestore();
        db.collection("users").doc(newDocument.userId)
            .get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('Usuario no existe, id buscado: ' + newDocument.userId);
                    return false;
                }

                const token = doc.data().token;
                if (token === undefined)
                    return false;                

                const payload = {
                    notification: {
                        title: "Cambio de Estatus",
                        body: "Tu orden de '" + newDocument.storeName + "' esta " + statusStrings[newDocument.statusId - 1]
                    },
                    token: token
                }

                functions.logger.log('notifcation', '', payload);

                return admin.messaging().send(payload);
            })
            .catch(err => {
                console.log('error al buscar el usuario por id: ' + newDocument.userId, err);
            });

            if(newDocument.statusId===5){
            let usersRef=db.collection("users");
        let query=usersRef.where('restaurantId','==',newDocument.restaurantId)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('usuario/restaurant no existe, id buscado: ' + newDocument.restaurantId);
                    return false;
                }

                snapshot.forEach(doc=>{

                const token = doc.data().token;
                if (token === undefined){
                    return false;                
                }

                const payload = {
                    notification: {
                        title: "Orden Cancelada",
                        body: "Orden de "+newDocument.name+" ($" + newDocument.total+")"
                    },
                    token: token
                }

                functions.logger.log('notifcation', '', payload);
                admin.messaging().send(payload);
                });


                return true;
            })
            .catch(err => {
                console.log('error al buscar el restaurant por id: ' + newDocument.restaurantId, err);
            });
        }
        return true;        
    });


exports.changeStatusNotificationRestaurant = functions.firestore
.document('orders/{orderId}')
.onCreate((change, context) => {
    const newDocument = change.data();
    let db = admin.firestore();

    db.collection("locations").doc("CAMBIAR POR TU 'locationId'").collection("restaurants").doc(newDocument.restaurantId)
        .get().then(restaurantInfo => {
            if (!restaurantInfo.exists) {
                console.log('Restaurant no existe, id buscado: ' + newDocument.restaurantId);
                return false;
            }

            if(restaurantInfo.data().isOpen) {
                db.collection("users").doc(newDocument.userId)
                .get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('Usuario no existe, id buscado: ' + newDocument.userId);
                        return false;
                    }

                    const token = doc.data().token;
                    if (token === undefined)
                        return false;                

                    const payload = {
                        notification: {
                            title: "Orden Recibida",
                            body: "Tu orden de '" + newDocument.storeName + "' fue " + statusStrings[newDocument.statusId - 1]
                        },
                        token: token
                    }

                    functions.logger.log('notifcation', '', payload);

                    return admin.messaging().send(payload);
                })
                .catch(err => {
                    console.log('error al buscar el usuario por id: ' + newDocument.userId, err);
                });
                
                let usersRef=db.collection("users");
                console.log('restaurant a buscar: '+newDocument.restaurantId);
                
                usersRef.where('restaurantId','==',newDocument.restaurantId)
                    .get()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            console.log('usuario/restaurant no existe, id buscado: ' + newDocument.restaurantId);
                            return false;
                        }
                        
                        snapshot.forEach(doc=>{
                            
                            const token = doc.data().token;
                            if (token === undefined){
                                return false;
                            }
                            
                            const payload = {
                                data: {
                                    title: "Nueva orden recibida",
                                    body: "Orden de "+newDocument.name+" ($" + newDocument.total+")"
                                },
                                token: token
                            }
                            
                            functions.logger.log('notifcation', '', payload);
                            admin.messaging().send(payload);
                        });
                        
                        return true;
                    })
                    .catch(err => {
                        console.log('error al buscar el restaurant por id: ' + newDocument.restaurantId, err);
                    });
            } else {
                db.collection("orders").doc(newDocument.id).update({statusId: 5});
                return true;
            }
        }).catch(err => {
            console.log('error al buscar el restaurant por id: ' + newDocument.restaurantId, err);
        });
        return true;        
    });
