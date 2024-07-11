const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js")
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/",(req,res) =>{
    res.send("Hello World");
})

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
    await mongoose.connect("mongodb://localhost:27017/TODO-TASK");
}
// SHOW ROUTE
app.get('/Task', async (req, res, next) => {
    try {
        let tasks = await Task.find();
        res.render('showTask.ejs', { tasks });
    } catch (err) {
        next(new ExpressError(500, 'Server Error'));
    }
});
// CREATE ROUTE  
app.get("/Task/new",(req,res)=>{
    res.render("new.ejs");
})

app.post('/Task', async (req, res, next) => {
    let { title, description } = req.body;

    try {
        if (!title || !description) {
            throw new ExpressError(400, 'Title and description are required');
        }

        let newTask = new Task({
            title: title,
            description: description,
            created_at: new Date()
        });

        await newTask.save();
        res.redirect('/Task');
    } catch (err) {
        if (err.name === 'ValidationError') {
            next(new ExpressError(400, 'Invalid data format'));
        } else {
            next(new ExpressError(500, 'Server Error'));
        }
    }
});

// Edit Route
app.get("/Task/:id/edit", async (req, res) => {
        const { id } = req.params;
        const task = await Task.findById(id);
        res.render("edit", { task });
});
// update route
app.put('/Task/:id', async (req, res, next) => {
    const { id } = req.params;
    const { title: newTitle, description: newDescription } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title: newTitle, description: newDescription },
            { runValidators: true, new: true }
        );

        if (!updatedTask) {
            return next(new ExpressError(404, 'Task not found'));
        }

        res.redirect('/Task');
    } catch (err) {
        next(new ExpressError(500, 'Server Error'));
    }
});



// Delete Route
app.delete("/Task/:id",async(req,res)=>{
    let {id} = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect("/Task");
});


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

// Error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Somthing went wrong"} = err;
    res.status(status).send(message);
})

app.listen(port,()=>{
    console.log("working well")
})