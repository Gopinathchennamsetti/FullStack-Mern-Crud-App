import React, { useState, useEffect } from "react";
import './App.css'; 
function App() {
	const [books, setBooks] = useState([]);
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	const [author, setAuthor] = useState("");
	const [price, setPrice] = useState("");
	const [editBookId, setEditBookId] = useState(null); // Track the book being edited
	const [editName, setEditName] = useState("");
	const [editId, setEditId] = useState("");
	const [editAuthor, setEditAuthor] = useState("");
	const [editPrice, setEditPrice] = useState("");

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		fetch("http://localhost:3000/books")
			.then((response) => response.json())
			.then((data) => setBooks(data))
			.catch((error) => console.error("Error fetching data:", error));
	};

	const handleCreate = () => {
		fetch("http://localhost:3000/books", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, id, author, price }),
		})
			.then(() => {
				fetchData();
				setName("");
				setId("");
				setAuthor("");
				setPrice("");
			})
			.catch((error) => console.error("Error creating book:", error));
	};

	const handleEdit = (book) => {
		setEditBookId(book._id);
		setEditName(book.name);
		setEditId(book.id);
		setEditAuthor(book.author);
		setEditPrice(book.price);
	};

	const handleUpdate = () => {
		fetch(`http://localhost:3000/books/${editBookId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: editName, id: editId, author: editAuthor, price: editPrice }),
		})
			.then(() => {
				fetchData();
				setEditBookId(null);
				setEditName("");
				setEditId("");
				setEditAuthor("");
				setEditPrice("");
			})
			.catch((error) => console.error("Error updating book:", error));
	};

	const handleDelete = (id) => {
		fetch(`http://localhost:3000/books/${id}`, {
			method: "DELETE",
		})
			.then(() => fetchData())
			.catch((error) => console.error("Error deleting book:", error));
	};

	return (
		<div>
			<h1>BOOK MANAGEMENT SYSTEM</h1>
			<div>
				<h2>Create/Update Book</h2>
				{editBookId ? (
					<div>
						<input
							type="text"
							placeholder="Name"
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Id"
							value={editId}
							onChange={(e) => setEditId(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Author"
							value={editAuthor}
							onChange={(e) => setEditAuthor(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Price"
							value={editPrice}
							onChange={(e) => setEditPrice(e.target.value)}
						/>
						<button onClick={handleUpdate}>Update</button>
						<button onClick={() => setEditBookId(null)}>Cancel</button>
					</div>
				) : (
					<div>
						<input
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Id"
							value={id}
							onChange={(e) => setId(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Author"
							value={author}
							onChange={(e) => setAuthor(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Price"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
						<button onClick={handleCreate}>Create</button>
					</div>
				)}
			</div>
			<div>
				<h2>Books</h2>
				<ul>
					{books.map((book) => (
						<li key={book._id}>
							<strong>{book.name} {book.id} {book.author}</strong> - {book.price}
							<button onClick={() => handleEdit(book)}>Edit</button>
							<button onClick={() => handleDelete(book._id)}>Delete</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
export default App;
