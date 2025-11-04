import express from "express";
import staticTestCoodinates from "./db/testData.json" with {type:"json"}; //this should be removed after db migration
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//This should be removed after db shifts from local
//to prod
//This is there to resolve issues with another server 
//requesting data from this one
app.use(cors());


const date = new Date();
console.log("server started");

//routes to user pictures
app.use("/user_data/", express.static("./user_data/"));

app.use("/", express.static("./frontend/dist"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//this route just returns static files test JSON data to not have to deal with
//seting up data flows quite yet
app.use("/api/test",(req,res) => {
  console.log("Sending JSON test data",date.getMinutes(),date.getSeconds());
  res.json({staticTestCoodinates,});
});

