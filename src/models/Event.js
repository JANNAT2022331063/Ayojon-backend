import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define("Event", {
  organizer_name: DataTypes.STRING,
  organizer_mobile: DataTypes.STRING,
  organizer_role: DataTypes.STRING,
  proof_file: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  date: DataTypes.DATEONLY,
  time: DataTypes.STRING,
  location: DataTypes.STRING,
  price: DataTypes.FLOAT,
  registration_deadline: DataTypes.DATEONLY,
  event_link: DataTypes.STRING,
  image: DataTypes.STRING,
});

export default Event;
