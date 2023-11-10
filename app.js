const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "*",
//   })
// );

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./routes/user");
const homePageRouter = require("./routes/homepage");
const chatRouter = require("./routes/chat");
const groupRouter = require("./routes/group");

//Models
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const UserGroup = require("./models/usergroup");

//Relationships between Tables
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });

Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homepage", homePageRouter);

app.use("/chat", chatRouter);

app.use("/group", groupRouter);

app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
   return res.status(204).end();
  }
  console.log(`Requested URL: ${req.url}`);
  res.sendFile(path.join(__dirname, `/public/${req.url}`));
});

const job = require("./jobs/cron");
job.start();

sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
