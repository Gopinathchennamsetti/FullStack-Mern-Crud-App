const cors = require("cors");
const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb"); // Import MongoClient and ObjectId

const app = express();
const port = 3000;
const mongoURI = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const dbName = "book_app";

app.use(bodyParser.json());
app.use(cors([]));

// Create a new book
app.post("/books", async (req, res) => {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection("books");

		const book = req.body;
		const result = await collection.insertOne(book);
		client.close();

		res.json(result.ops[0]);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Retrieve all books
app.get("/books", async (req, res) => {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection("books");

		const books = await collection.find({}).toArray();
		client.close();

		res.json(books);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Retrieve a specific book by ID
app.get("/books/:id", async (req, res) => {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection("books");

		const bookId = req.params.id;
		const book = await collection.findOne({ _id: new ObjectId(bookId) });

		client.close();

		if (!book) {
			res.status(404).send("Book not found");
		} else {
			res.json(book);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// Update a book by ID
app.put("/books/:id", async (req, res) => {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection("books");

		const bookId = req.params.id;
		const updatedBook = req.body;
		const result = await collection.updateOne(
			{ _id: new ObjectId(bookId) },
			{ $set: updatedBook }
		);

		client.close();

		if (result.matchedCount === 0) {
			res.status(404).send("Book not found");
		} else {
			res.json(updatedBook);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// Delete an item by ID
app.delete("/books/:id", async (req, res) => {
	try {
		const client = new MongoClient(mongoURI);
		await client.connect();

		const db = client.db(dbName);
		const collection = db.collection("books");

		const bookId = req.params.id;
		const result = await collection.deleteOne({ _id: new ObjectId(bookId) });

		client.close();

		if (result.deletedCount === 0) {
			res.status(404).send("Book not found");
		} else {
			res.json({ message: "Book deleted" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});


app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});