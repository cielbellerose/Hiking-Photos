import express from "express";
import session from "express-session";
import staticTestCoodinates from "./db/testData.json" with { type: "json" }; //this should be removed after db migration
import cors from "cors";
import loginRouter from "./routes/LoginRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//This should be removed after db shifts from local
//to prod
//This is there to resolve issues with another server
//requesting data from this one
app.use(cors({ origin: true, credentials: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", //change later
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //   mongoUrl: process.env.MONGO_URL,
    //   collectionName: "sessions",
    // }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

const date = new Date();
console.log("server started");

// app.use("/api", loginRouter);

//this route just returns static files test JSON data to not have to deal with
//seting up data flows quite yet
app.use("/api/test", (req, res) => {
  console.log("Sending JSON test data", date.getMinutes(), date.getSeconds());
  res.json({ staticTestCoodinates });
});

//routes to user pictures
app.use("/user_data/", express.static("./user_data/"));
app.use("/", express.static("./frontend/dist"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
