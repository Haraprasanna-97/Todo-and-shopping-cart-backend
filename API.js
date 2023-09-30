const express = require('express')
var cors = require('cors')
const app = express()
var bodyParser = require('body-parser')

const { MongoClient } = require('mongodb');

let uri = "mongodb+srv://Hara:KzOTXqnB8fkE7B3W@cluster0.agnnqi2.mongodb.net/";
let client = new MongoClient(uri);

async function connectAndStore(data, dbName, collectionName) {
    try {
        await client.connect()
    } catch (error) {
        console.log("Connection failed.")
    }

    let database = client.db(dbName);
    let collection = database.collection(collectionName);

    try {
        const insertResult = await collection.insertOne(data);
        return insertResult.acknowledged;
    }
    catch (error) {
        console.log("Insert failed.")
        return false
    }
    finally {
        await client.close();
    }
}

async function connectAndCheckAvaility(data, dbName, collectionName) {
    try {
        await client.connect()
    } catch (error) {
        console.log("Connection failed.")
    }

    let database = client.db(dbName);
    let collection = database.collection(collectionName);
    let query = { listName: data.listName }

    try {
        let document = collection.findOne(query)
        return document
    }
    catch (error) {
        return false
    }
    // finally {
    //     await client.close();
    // }
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/feedback', async function (req, res) {
    let response = await connectAndStore(req.body, "TodoAndShopingCart", "Feedbacks")
    if (response) {
        res.send("Thank you for your feedback")
    } else {
        res.send("Sorry, we could not save your feedback")
    }
})

app.post("/saveList", async function (req, res) {
    let response = await connectAndCheckAvaility(req.body, "TodoAndShopingCart", "Lists")
    if (response) {
        res.send("saved")
    } else {
        // res.send("F")
        let response = await connectAndStore(req.body, "TodoAndShopingCart", "Lists")
        if (response) {
            res.send("Saved")
        } else {
            res.send("Sorry, something went wrong")
        }
    }
})

app.listen(3001)