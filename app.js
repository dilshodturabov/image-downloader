const fs = require('fs');
const axios = require('axios');
const path = require('path');
var XLSX = require('xlsx');

// Load the Excel file
var workbook = XLSX.readFile('Result_20.xlsx');
// Get the first sheet
var sheet_name_list = workbook.SheetNames;

var worksheet = workbook.Sheets[sheet_name_list[0]];

// // Convert the sheet to JSON
var data = XLSX.utils.sheet_to_json(worksheet);
console.log(data);

async function downloadImages(data) {
    for (let i = 0; i < data.length; i++) {
        const url = data[i]['concat'];
        let filename = data[i]['name'];

        // Add the image extension to the filename
        const extension = path.extname(url);
        filename += extension;

        // Specify your directory here
        const dir = './result/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const filePath = path.resolve(dir, filename);

        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}

// Call the function with your data
downloadImages(data);

