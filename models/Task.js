const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskSchema =  Schema({
    title:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required : true,
    },
    created_at: {
        type: Date,
        default: new Date(),
        required : true,
    }
});
const Task = mongoose.model("Task",TaskSchema);
module.exports = Task;