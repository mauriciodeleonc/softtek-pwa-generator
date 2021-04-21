import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
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

