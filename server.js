const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, "/");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

app.get('/', (req,res) => {
    res.sendFile(path.join(initial_path, "/home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "/editor.html"));
})

//upload link

app.post('/uploads', (req, res) => {
    if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.image;
    const date = new Date();
    const imagename = date.getDate() + date.getTime() + file.name;
    const uploadPath = path.join(__dirname, 'uploads', imagename);

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(`uploads/${imagename}`);
    });
});

app.get("/:blog", (req,res) => {
    res.sendFile(path.join(initial_path, "/blog.html"));
}) 

app.get("/:about", (req,res) => {
    res.sendFile(path.join(initial_path, "/about.html"));
}) 

app.get("/:contact", (req,res) => {
    res.sendFile(path.join(initial_path, "/contact.html"));
}) 
app.use((req,res) => {
    res.json("404");
})


app.listen("3000", () => {
    console.log('listening.....');
})