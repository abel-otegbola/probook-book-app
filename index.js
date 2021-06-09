const { render } = require("ejs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const Book = require("./modules/book")



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const dbUrl = "mongodb+srv://Abel:1234@nodetut.9kowg.mongodb.net/Abel-books?retryWrites=true&w=majority";
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err)
    })

app.get("/", (req, res) => {
    res.render("index", { title: "home" })
})
app.get("/about", (req, res) => {
    res.render("About", { title: "About" })
})
app.get("/Archive", (req, res) => {
    Book.find()
    .then(result => {
        res.render("Archive", { title: "Archive", result});
    })
    .catch(err => {
        console.log(err);
    })
})
app.get("/book/:id", (req, res) => {
    const ide = req.params.id
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${ide}=free-ebooks&download=epub&maxResults=30&key=AIzaSyAZk8N4z-fuCQIE77yb9ygLTJGokG8QpKQ`)
        .then(res => res.json())
        .then(json => {
            res.render("book", { title: json.items[0].volumeInfo.title, json : json.items[0]})
        })
        .catch(err => {
            console.log(err);
        })
})
app.get("/add-book/:id", (req, res) => {
    const id = req.params.id
    const book = new Book({
        title: id
    })
    book.save()
    .then(result => {
        res.redirect("/Archive");
    })
    .catch(err => {
        console.log(err)
    })
})

app.get("/delete/:id", (req, res) => {
    const id = req.params.id;

    Book.findByIdAndDelete(id)
    .then(result => {
        res.redirect("/Archive")
    })
    .catch(err => {
        console.log(err)
    })
})
app.use((req, res) => {
    res.render("404", { title: "page not found" })
})