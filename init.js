const mongoose = require("mongoose");
const Task = require("./models/Task.js");
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
let allTASK = [
    {
        title:"Read-React",
        description:"I have to read react withing two days then only i am able to do some majore project",
        created_at: new Date(),
    },
    {
        title:"Read-AI-ML",
        description:"i should start learn AI-Ml other wise i will on back-foot in future",
        created_at: new Date(),
    },
    {
        title:"Docker",
        description:"i need to learn docker for manage dependecies in major projects",
        created_at: new Date(),
    },
]

Task.insertMany(allTASK);