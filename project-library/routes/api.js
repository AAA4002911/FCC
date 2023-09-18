/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require("mongoose");

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    comments: {
      type: [String],
      default: []
    }
  });

  let Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).then(allBooks => {
        const bookList = allBooks.map(inputBook => {
          return {
            _id: inputBook._id,
            title: inputBook.title,
            commentcount: inputBook.comments.length
          };
        });
        res.json(bookList);
      });
      
    })
    
    .post(function (req, res){
      let title = req.body.title;
      
      //title must not be empty
      if (!title){
        res.send("missing required field title");
        return;
      }
        
      //response will contain new book object including atleast _id and title
      Book.create({title: title}).then(doc => {
        if (!doc) {
          console.error("Something has gone wrong");
          return;
        }
        res.json({_id: doc._id, title: doc.title}); 
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}).then(() =>{
        res.send("complete delete successful");
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid).then(book => {
        if (!book){
          res.send("no book exists")
          return;
        }
        res.json(book);
        return;
      })
      .catch(err => {
        res.send("no book exists");
        return;
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      //comment must not be empty
      if(!comment){
        res.send("missing required field comment");
        return;
      }
      
      //json res format same as .get
      Book.findById(bookid).then(book => {
        if (!book){
          res.send("no book exists")
          return;
        }
        book.comments.push(comment);
        book.save().then(doc => {
          res.json(doc);
          return;
        })
        .catch(err => {
          console.error(err);
        });
      })
      .catch(err => {
        res.send("no book exists");
        return;
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid).then(book => {
        if (!book){
          res.send("no book exists")
          return;
        }
        res.send("delete successful");
        return;
      })
      .catch(err => {
        res.send("no book exists");
        return;
      });
    });
  
};
