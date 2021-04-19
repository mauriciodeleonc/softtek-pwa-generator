// //var path = require('path');
// //var fs = require("fs");
// //var JSZip = require("jszip");
//let readXlsxFile = require('read-excel-file/node/');
 const ExcelJS = require('exceljs');
var moment = require("moment");
//const remote = require('electron').remote;

var fs = require('fs');

//remote.dialog.showOpenDialog(remote.getCurrentWindow(), {properties:["openDirectory"]});

exports.aaa = async (path) => {


    
    console.log('yes')
    console.log(moment.now())
    try {  
        var data = fs.readFileSync('file.txt', 'utf8');
        console.log(data.toString());    
    } catch(e) {
        console.log('Error:', e.stack);
    }
    //let excelPath = 'C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm';
    // try {
    //     // const numSheets = (await readXlsxFile('excelPath', { getSheets: true })).length;
    //     // console.log(numSheets)

    //     // for (let i = 1; i <= numSheets; i++) {
    //     //     console.log('reading sheet', i)
    //     //     const sheetData = await readXlsxFile(excelPath, { sheet: i });
    //     //     console.log(sheetData)
    //     // }



    // let excelPath = 'C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm';
    //     // read from a file
    //     const workbook = new ExcelJS.Workbook();
    //     const x = await workbook.xlsx.readFile('formato_pwa.xlsm');
    //     console.log(x)
    //     // ... use workbook



    //     console.log('hi')
    // } catch (error) {
    //     console.log(error)
    // }


}
// // exports.readExcel = async (path) => {

// //     let excelPath = 'C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm';
// //     try {
// //         // read from a file
// //         const workbook = new ExcelJS.Workbook();
// //         const x = await workbook.xlsx.readFile(excelPath);
// //         console.log(x)
// //         // ... use workbook
// //     } catch (error) {
// //         console.log(error)
// //     }
// // }
// exports.readExcel = async (path) => {

//     let excelPath = 'C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm';
//     try {
//         const numSheets = (await readXlsxFile(excelPath, { getSheets: true })).length;
//         console.log(numSheets)

//         // for (let i = 1; i <= numSheets; i++) {
//         //     console.log('reading sheet', i)
//         //     const sheetData = await readXlsxFile(excelPath, { sheet: i });
//         //     console.log(sheetData)
//         // }
//         console.log('hi')
//     } catch (error) {
//         console.log(error)
//     }
// }