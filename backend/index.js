const express = require("express");
const connectDB = require("./config/db.js");
const userRouter = require("./routes/EmployeeRoute.js");
const app = express();
const cors = require("cors");
const patientRouter = require("./routes/PatientRoute.js");

app.use(cors());
app.use(express.json());
app.use("/api/employee", userRouter);
app.use("/api/patient", patientRouter);

connectDB();

app.listen(8080, () => console.log("Server running on port 8080"));
