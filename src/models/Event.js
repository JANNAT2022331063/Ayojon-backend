// src/models/Event.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js"; // ✅ corrected import

const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: true },
  capacity: { type: DataTypes.INTEGER, defaultValue: 0 },
  price: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  imageUrl: { type: DataTypes.STRING, allowNull: true }
});

// relations
Event.belongsTo(User, { as: "organizer", foreignKey: "organizerId" });
User.hasMany(Event, { foreignKey: "organizerId" });

export default Event;
