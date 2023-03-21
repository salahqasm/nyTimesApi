const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios");

const psql = "postgres://postgres:postgres@localhost:5432/salah"
const sequelize = new Sequelize(psql, {});

const start = (port) => {
    app.listen(port, () => {
        console.log(`********************Server running on port: ${port}****************************`);
    })
};

const Books = sequelize.define('book', {
    title: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    },
    summary: {
        type: DataTypes.TEXT
    }
}, { timestamps: false });

sequelize.sync({ force: true }).then(() => {
    console.log(`********************Database Connected Successfuly****************************`);
    start(3001);
}).then(async () => {
    let result;
    await axios.get('https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=dfCTQmcAYXGiqaB0HxUr4ItRzc3Kyb6P').then(
        (res)=>{
            result=res.data;
        }
    )
    result.results.map(elem=>{
        Books.create({
            title:elem.book_title,
            author:elem.book_author,
            summary:elem.summary
        })
    })
});








