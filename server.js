const express = require('express');
const mongoose = require('mongoose');
var app = express();
var Data = require('./noteSchema');

mongoose.connect('mongodb://localhost/newDB');

mongoose.connection.once('open', () => {
    console.log('Connected to database.');
}).on('error', (error) => { 
    console.log('Failed to connect ' + error);
})

 // Create a note POST
app.post('/create', (req, res) => {

    // Create the note data.
    var note = new Data({
        note: req.get('note'),
        title: req.get('title'),
        date: req.get('date')
    });


    // Save the note data to the database.
    note.save().then(() => {
        // If note.isNew == true -> the data failed to save on the database. It's only saved on the server.
        if (note.isNew == false) {
            console.log('Saved data.');
            res.send('Saved data.');
        } else {
            console.log('Failed to save data.');
        }

    });
});


// http://192.168.0.22:8081/create
var server = app.listen(8081, '192.168.0.22', () => {
    console.log('Server is running.');
});

 // Delete a note POST
app.post('/delete', (req, res) => {
    Data.findOneAndRemove({
        _id: req.get('id')
    }, (err) => {
        console.log(`Unable to delete note. Error: ${err}`);
    });

    res.send('Deleted!');
});

 // Update a note POST
app.post('/update', (req, res) => {
    Data.findOneAndUpdate({
        _id: req.get('id')
    }, {
        note: req.get('note'),
        title: req.get('title'),
        date: req.get('date')
    }, {
        useFindAndModify: false,
        // new: true
    }, (err, result) => {
        if (result) {
            console.log(`Note has been updated. ${result}`);
            res.send('Updated!');
        } else {
            console.log(`Error: ${err}`);
            res.send('Unable to update note.');
        }
    });
});



 // Fetch all notes GET
app.get('/fetch', (req, res) => {
    Data.find({}).then((DBItems) => {
        res.send(DBItems)
    });
});