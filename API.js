const express = require('express')
var cors = require('cors')
const app = express()
var bodyParser = require('body-parser')
require('dotenv').config();

const { MongoClient } = require('mongodb');

let uri = process.env.URI;
let client = new MongoClient(uri);

async function connectAndStore(data, dbName, collectionName) {
    try {
        await client.connect()
        let database = client.db(dbName);
        let collection = database.collection(collectionName);

        let findQuery = { listName: data.listName }
        let updateQuery = { $set: data }
        let option = { upsert: true }

        let updateResult = await collection.updateOne(findQuery, updateQuery);
        console.log(updateResult)
        if(updateResult.modifiedCount !== 1){
            let insertResult = await collection.insertOne(data);
            return insertResult.acknowledged;
        }
        return updateResult.acknowledged;

        // let document = await collection.findOne(findQuery)
        // if (document) {
        //     console.log(document)
        //     // update
        //     let updateResult = await collection.updateOne(findQuery, updateQuery, option);
        //     return updateResult.acknowledged;
        // }
        // else {
        //     let insertResult = await collection.insertOne(data);
        //     return insertResult.acknowledged;
        // }
    }
    catch (error) {
        console.log("Insert failed.")
        return false
    }
    // finally {
    //     await client.close();
    // }
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
    // let response = await connectAndCheckAvaility(req.body, "TodoAndShopingCart", "Lists")
    // if (response) {
    //     res.send({Message:"saved",success:"true"})
    // } else {
    //     // res.send("F")
    //     let response = await connectAndStore(req.body, "TodoAndShopingCart", "Lists")
    //     if (response) {
    //         res.send({Message:"saved",success:"true"})
    //     } else {
    //         res.send({Message:"Sorry, something went wrong", success:false})
    //     }
    // }

    let response = await connectAndStore(req.body, "TodoAndShopingCart", "Lists")
    if (response) {
        console.log(response)
        res.send({ Message: "saved", success: true })
    } else {
        res.send({ Message: "Sorry, something went wrong", success: false })
    }
})

app.get("/getList", async (req,res) => {
    database = client.db("TodoAndShopingCart")
    collection = database.collection("Lists")
    query = {ListID : 1}

    try {
        let document = await collection.findOne(query)
        res.send({ data : document, success : true}) 
    }
    catch (error) {
        res.send({ Message: "Sorry, something went wrong", success: false })
    }
    
})

app.listen(3001)