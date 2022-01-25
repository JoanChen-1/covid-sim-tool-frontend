require("dotenv").config();

const fs = require('fs');
const path = require('path');

var { Pool } = require('pg')

const fastcsv = require("fast-csv");

const db = require('./models/covid-sim-db')


async function readAndImport(fpath, fname) {
    let stream = fs.createReadStream(fpath);
    let csvData = [];
    let csvStream = fastcsv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // remove the first line: header
            csvData.shift();

            // create a new connection to the database
            const pool = new Pool({
                host: process.env.DB_HOSTNAME,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT,
                connectionTimeoutMillis: 5000000,
                max: 100
            });

            const query =
                `INSERT INTO Public.\"${fname}\" (day ,infected_case_0 ,infected_case_1 ,infected_case_2 ,infected_case_3 ,infected_case_4 ,infected_case_5 ,infected_case_6 ,infected_case_7 ,infected_case_8 ,infected_case_9 ,sym_case_0 ,sym_case_1 ,sym_case_2 ,sym_case_3 ,sym_case_4 ,sym_case_5 ,sym_case_6 ,sym_case_7 ,sym_case_8 ,sym_case_9 ,asym_case_0 ,asym_case_1 ,asym_case_2 ,asym_case_3 ,asym_case_4 ,asym_case_5 ,asym_case_6 ,asym_case_7 ,asym_case_8 ,asym_case_9 ,infected_county_1 ,infected_county_2 ,infected_county_3 ,infected_county_4 ,infected_county_5 ,infected_county_6 ,infected_county_7 ,infected_county_8 ,infected_county_9 ,infected_county_10 ,infected_county_11 ,infected_county_12 ,infected_county_13 ,infected_county_14 ,infected_county_15 ,infected_county_16 ,infected_county_17 ,infected_county_18 ,infected_county_19 ,infected_county_20 ,infected_county_21 ,infected_county_22 ,infected_county_23 ,infected_county_24 ,infected_county_25 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56)`;

            pool.connect((err, client, done) => {
                if (err) throw err;

                try {

                    let cnt = 0;
                    csvData.forEach(row => {
                        client.query(query, row, (err, res) => {
                            if (err) {
                                console.log(err.stack);
                            } else {
                                cnt += 1;
                                if (cnt % 100 === 0)
                                    console.log("inserted " + cnt + ` into ${fname}`);
                            }
                        });
                    });
                } finally {
                    console.log('bruh')
                }
            });
        });

    stream.pipe(csvStream);

    return;
}

async function truncateTable(fname) {
    let truncateTable = `TRUNCATE TABLE public.\"${fname}\"`
    await db.query(truncateTable)
}

async function importCSVToDB(fname, fpath) {
    let createTable = `CREATE TABLE public.\"${fname}\" (day integer,infected_case_0 integer,infected_case_1 integer,infected_case_2 integer,infected_case_3 integer,infected_case_4 integer,infected_case_5 integer,infected_case_6 integer,infected_case_7 integer,infected_case_8 integer,infected_case_9 integer,sym_case_0 integer,sym_case_1 integer,sym_case_2 integer,sym_case_3 integer,sym_case_4 integer,sym_case_5 integer,sym_case_6 integer,sym_case_7 integer,sym_case_8 integer,sym_case_9 integer,asym_case_0 integer,asym_case_1 integer,asym_case_2 integer,asym_case_3 integer,asym_case_4 integer,asym_case_5 integer,asym_case_6 integer,asym_case_7 integer,asym_case_8 integer,asym_case_9 integer,infected_county_1 integer,infected_county_2 integer,infected_county_3 integer,infected_county_4 integer,infected_county_5 integer,infected_county_6 integer,infected_county_7 integer,infected_county_8 integer,infected_county_9 integer,infected_county_10 integer,infected_county_11 integer,infected_county_12 integer,infected_county_13 integer,infected_county_14 integer,infected_county_15 integer,infected_county_16 integer,infected_county_17 integer,infected_county_18 integer,infected_county_19 integer,infected_county_20 integer,infected_county_21 integer,infected_county_22 integer,infected_county_23 integer,infected_county_24 integer,infected_county_25 integer)`
    // console.log('Creating table')
    try {
        // console.log('Creating table')
        await db.query(createTable)
        console.log(`Created table: ${fname}`)
    } catch (err) {
        console.log(`Already exists! Truncating...`)
        await truncateTable(fname)

    }
    await readAndImport(fpath, fname)

    return true;
}


// Make an async function that gets executed immediately
(async () => {
    // Our starting point
    try {
        let dir = 'D://109_2//academia-sinica//data//doubleStrategy//MK_Vacc//00'
        // Get the files as an array
        const files = await fs.promises.readdir(dir);

        // Loop them all with the new for...of
        for (const file of files) {
            // Get the full paths
            const fpath = path.join(dir, file);

            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(fpath);

            if (stat.isFile())
                console.log("'%s' is a file.", file);
            else if (stat.isDirectory())
                console.log("'%s' is a directory.", fpath);

            // Now move async
            let aaa = await importCSVToDB(file.replace('.csv', ''), fpath)

            // Log because we're crazy
            console.log("Read %s", fpath);
        } // End for...of
    }
    catch (e) {
        // Catch anything bad that happens
        console.error("We've thrown! Whoops!", e);
    }

})(); // Wrap in parenthesis and call now