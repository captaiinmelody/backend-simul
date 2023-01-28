import {  Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";

// const {DataTypes} = Sequelize;

const AllData = db.define('link_video', {
    title:{
        type: DataTypes.STRING,
    },
    links:{
        type: DataTypes.STRING,
    },
    category:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT
    },
    comment_count: {
        type: DataTypes.INTEGER
    },
    like:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default AllData;