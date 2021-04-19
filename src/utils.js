let readXlsxFile = window.require('read-excel-file/node/');
exports.readExcel = async (excelFilePath) => {
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

exports.connectFirebase = async (config) => {
    console.log('connecting to fb')
}