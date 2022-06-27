// modules required for routing
import express from 'express';
import { CallbackError } from 'mongoose';
const router = express.Router();
export default router;

// define the book model
import Book from '../Models/books';

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find((err, books) => {
    if (err) {
      console.error(err);
      res.end(err);
    }
    else {
      res.render('books/index', { title: 'Books', page: 'books', books: books });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  res.render('books/details', { title: "Add", page: 'book-add', book: {} });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  // New Book object
  let newBook = new Book
    ({
      "Title": req.body.title,
      "Description": req.body.description,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

  // Insert the new Book object into the database
  Book.create(newBook, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    // New Book has been added -> refresh the book list
    res.redirect('/books');
  })
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  let id = req.params.id;

  // pass the id to the db and read the book into the edit page
  Book.findById(id, {}, {}, function (err, bookToEdit) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    // show the edit view with the data
    res.render('books/details', { title: 'Edit', page: 'book-edit', book: bookToEdit })
  });
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  let id = req.params.id;

  // New Book Object
  let updatedBook = new Book
    ({
      "_id": id,
      "Title": req.body.title,
      "Description": req.body.description,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

  // update the book in the database
  Book.updateOne({ _id: id }, updatedBook, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    // edit was successful -> go to the book list page
    res.redirect('/books');
  });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  /*****************
   * ADD CODE HERE *
   *****************/
  let id = req.params.id;

  // pass the id to the database and delete the book
  Book.remove({ _id: id }, function (err: CallbackError) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    // delete was successful
    res.redirect('/books');
  });
});

module.exports = router;
