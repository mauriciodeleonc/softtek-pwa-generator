import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
const fs = window.require('fs-extra');
let readXlsxFile = window.require('read-excel-file/node/');
export const readExcel = async (excelFilePath) => {
    //let excelPath = 'C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm';
    const sheets = [];
    try {
        const numSheets = (await readXlsxFile(excelFilePath, { getSheets: true })).length;
        //console.log(numSheets)

        for (let i = 1; i <= numSheets; i++) {
            //console.log('reading sheet', i)
            const sheetData = await readXlsxFile(excelFilePath, { sheet: i });
            //console.log(sheetData)
            sheets.push(sheetData);
        }
        return sheets
    } catch (error) {
        console.log(error)
    }
}

export const connectFirebase = async (config) => {
    const app = firebase.initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
    })
    const db = app.firestore();
    const storage = app.storage();
    return [db, storage];
}

export const uploadExcelData = async (storeName, fbConfig, excelPath) => {
    try {
        let excelData = await readExcel(excelPath);
        //remove unused restaurant sheets
        excelData = excelData.filter((el) => {
            return el.length > 0;
          });
        console.log('excel data:', excelData);
        //check if excel data is complete. return if not
        for (const rest of excelData) {
            if (!rest[1][1] || !rest[2][1] || !rest[3][1] || !rest[4][1] || !rest[5][1] || !rest[6][1] || !rest[7][1] || !rest[8][1]) {
                console.log('Excel restaurant data missing')
                return
            }
            for (let i = 12; i < rest.length; i++) {
                if (!rest[i][0] || !rest[i][1] || !rest[i][2] || !rest[i][3] || !rest[i][4] || !rest[i][5] || !rest[i][6]) {
                    console.log('Excel restaurant product data missing')
                    return
                }
            }
        }
        //connect to firebase
        const [db, storage] = await connectFirebase({
            apiKey: fbConfig.apiKey,
            authDomain: fbConfig.authDomain,
            projectId: fbConfig.projectId,
            storageBucket: fbConfig.storageBucket,
            messagingSenderId: fbConfig.messagingSenderId,
            appId: fbConfig.appId,
        })

        const batch = db.batch();
        batch.set(db.collection('faq').doc(), {
            questions: '¿Puedo actualizar el "Cajón de estacionamiento"?',
            answer: 'Una vez especificado el cajón ya no podrá actualizar la información, le recomendamos hacer la especificación una vez que se encuentre en el área reservada para "Order to Go"',
            position: 1
        })
        batch.set(db.collection('faq').doc(), {
            questions: '¿Dónde encuentro el número "Cajón de estacionamiento"?',
            answer: 'En el estacionamiento del centro comercial encontrará un área reservada para "Order to Go" y cada cajón tendrá una numeración que deberá de usar en la app',
            position: 2
        })
        batch.set(db.collection('faq').doc(), {
            questions: '¿Dónde actualizo el número de "Cajón de estacionamiento"?',
            answer: 'Una vez creada la orden, dirigirse a "Ordenes" en el menú inferior y dar click sobre "CAJÓN" de la orden a actualizar',
            position: 3
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Porqué se canceló mi orden?",
            answer: "Existen varias razones por las cual una orden puede ser cancelada (comercio ha cerrado, producto no disponible, etc). Le recomendamos contactar al comercio para obtener más detalle",
            position: 4
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Cómo se calcula la hora de entrega?",
            answer: "El tiempo estimado que aparece incluye el tiempo que le lleva a un restaurante aceptar y preparar un pedido promedio, y el tiempo que debería tomarle al establecimiento hacer la entrega en el punto acordado.",
            position: 11
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Cómo puedo identificar cuando el personal del establecimiento realizará mi entrega?",
            answer: 'En la sección de "Ordenes" podrá ver el estatus de su pedido. Asegúrese de haber introducido el número de cajón, o de haber contactado al establecimiento para determinar el punto de entrega.',
            position: 12
        })
        batch.set(db.collection('faq').doc(), {
            questions: "Necesito hablar sobre mi pedido con el personal de entrega del establecimiento ¿cómo lo hago?",
            answer: "Diríjase a la sección del restaurante, luego presione sobre el número telefónico para iniciar la llamada. (Tendrá que aceptar permisos para llamar)",
            position: 13
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Dónde debo esperar al personal de entrega del establecimiento?",
            answer: 'Tiene que ubicarse en el área reservada para "Order to Go", o puede comunicarse con el establecimiento para acordar un punto.',
            position: 14
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Puedo hacer un pedido a domicilio por medio de la app?",
            answer: 'No, todos los pedidos realizados en la app son para recoger en el área reservada para "Order to Go".',
            position: 15
        })
        batch.set(db.collection('faq').doc(), {
            questions: "¿Tengo que realizar un pago extra a la app al hacer uso de ella?",
            answer: "No, todos los cobros de los pedidos que se realicen por medio de la app son llevados a cabo directamente por el establecimiento",
            position: 16
        })
        batch.commit();

        //add locations collection
        const locations = await db.collection('locations').add({
            isVisible: true,
            name: storeName
        })
        //update locations id field
        const locationsRef = db.collection('locations').doc(locations.id);
        await locationsRef.set({ id: locations.id }, { merge: true });

        //upload restaurant excel data to firebase
        for (const excelRestaurant of excelData) {
            //upload restaurant logo to firebase storage
            const localImage = await fs.readFileSync(excelRestaurant[8][1])
            const logoRef = await storage.ref().child(`/restaurantes/${excelRestaurant[1][1]}/logo_${excelRestaurant[1][1]}`)
            await logoRef.put(localImage, { contentType: 'image/jpeg' })
            const logoUrl = await logoRef.getDownloadURL()
            const paymentTypes = [];
            if (excelRestaurant[6][1].toLowerCase() === "sí" || excelRestaurant[6][1].toLowerCase() === "si") paymentTypes.push('Efectivo')
            if (excelRestaurant[7][1].toLowerCase() === "sí" || excelRestaurant[7][1].toLowerCase() === "si") paymentTypes.push('Tarjeta')
            //create restaurants subcollection in locations document
            const restaurant = await locationsRef.collection("restaurants").add({
                hours: `De ${excelRestaurant[3][1]} a ${excelRestaurant[4][1]}`,
                imageURL: logoUrl,
                name: excelRestaurant[1][1],
                description: excelRestaurant[2][1],
                paymentTypes: paymentTypes,
                phone: excelRestaurant[5][1],
                isOpen: true
            })
            //update id field
            const restaurantRef = await locationsRef.collection('restaurants').doc(restaurant.id);
            await restaurantRef.set({ id: restaurant.id }, { merge: true });

            //add restaurant's products
            for (let i = 12; i < excelRestaurant.length; i++) {
                //upload product image to firebase storage
                const localProductImage = await fs.readFileSync(excelRestaurant[i][6])
                const productImgRef = await storage.ref().child(`/restaurantes/${excelRestaurant[1][1]}/productos/${excelRestaurant[i][1]}`)
                await productImgRef.put(localProductImage, { contentType: 'image/jpeg' })
                const productImageUrl = await productImgRef.getDownloadURL()
                const product = await restaurantRef.collection("products").add({
                    category: excelRestaurant[i][0],
                    name: excelRestaurant[i][1],
                    description: excelRestaurant[i][2],
                    price: excelRestaurant[i][3],
                    estimated_time: excelRestaurant[i][4],
                    isAvailable: (excelRestaurant[i][5].toLowerCase() === "sí" || excelRestaurant[i][5].toLowerCase() === "si") ? true : false,
                    img: productImageUrl
                })
                await restaurantRef.collection('products').doc(product.id).set({ id: product.id }, { merge: true });
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export const generatePWA = async (dest, folderName, iconImg, iconPath) => {
    //copy pwa folder to destination destination path
    try {
        dest = dest + '/' + folderName
        await fs.ensureDirSync(dest);
        const src = './src/pwa';
        await fs.copy(src, dest)
        //copy firebase functions index
        await fs.copy('./src/functions', dest.split('/')[0]);
        //read icon and save in destination folder
        const icon = await fs.readFileSync(iconPath)
        await fs.writeFileSync(`${dest}/public/logo.png`, icon)
    } catch (err) {
        console.log(err)
    }
}

export const generateEnv = async (projectPath, fbConfig, appName) => {
    //create .env file with firebase config in created pwa project
    try {
        const data = `REACT_APP_FIREBASE_API_KEY=${fbConfig.apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${fbConfig.authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${fbConfig.projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${fbConfig.storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${fbConfig.messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${fbConfig.appId}
REACT_APP_APP_NAME=${appName}`
        await fs.writeFileSync(`${projectPath}/.env`, data)
    } catch (err) {
        console.log(err)
    }
}

export const generateManifest = async (projectPath, appName) => {
    //create manifest file in created pwa project
    try {
        const data = `{
            "short_name": "${appName}",
            "name": "${appName}",
            "icons": [
              {
                "src": "favicon.ico",
                "sizes": "64x64 32x32 24x24 16x16",
                "type": "image/x-icon"
              },
              {
                "src": "logo.png",
                "type": "image/png",
                "sizes": "512x512"
              }
            ],
            "gcm_sender_id": "103953800507",
            "start_url": "/",
            "scope": "/",
            "display": "standalone",
            "theme_color": "#000000",
            "background_color": "#ffffff"
          }`
        await fs.writeFileSync(`${projectPath}/public/manifest.json`, data)
    } catch (err) {
        console.log(err)
    }
}


export const generateCss = async (projectPath, appColor) => {
    //create css file in created pwa project
    try {
        const rgb = appColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
            , (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16))
        let css = await fs.readFileSync('./src/pwa/src/index.css', 'utf8')
        css += `
:root { 
    --main-text: #001833;
    --gray-text: #606F81;
    --main-light: #FAFCFF;
    --background-color: #FCFCFC;
    --error: #FF3333;
    --light-error: #FFE5E6;
    --main: ${appColor ? appColor : '#FF6961'};
    --main-shadow: rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4);
    --secondary-button: rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4);
    --main-green: #00E52F;
    --light-green: #E5FFEB;
    --main-blue: #15F4EE;
    --light-blue: #E7FEFD;
    --main-yellow: #FCE839;
    --light-yellow: #FFFCE6;
    --main-orange: #FF8300;
    --light-orange: #FFF3E5;
    --border-gray: rgba(0, 24, 51, 0.1);
  }
        `;
        await fs.writeFileSync(`${projectPath}/src/index.css`, css)
    } catch (err) {
        console.log(err)
    }
}