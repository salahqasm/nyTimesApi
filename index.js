const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios");

//initializing sequelize object to connect with Postgresql Database
const psql = "postgres://postgres:postgres@localhost:5432/salah"
const sequelize = new Sequelize(psql, {});

//start function .. to start the app
const start = (port) => {
    app.listen(port, () => {
        console.log(`********************Server running on port: ${port}****************************`);
    })
};

//defining Books schema
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


//connecting to database and start the app and then call the api using axios library
sequelize.sync({ force: true }).then(() => {
    console.log(`********************Database Connected Successfuly****************************`);
    start(3001);
}).then(async () => {

    //calling the api that retrieves books with author name: Stephen King

    await axios.get('https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=dfCTQmcAYXGiqaB0HxUr4ItRzc3Kyb6P').then(
        (res) => {
            
            //in order to reach to actual result we need to call res.data.result where it is the structure of json response of the result
            res.data.results.map(elem => {
                Books.create({
                    title: elem.book_title,
                    author: elem.book_author,
                    summary: elem.summary
                })
            });
        }
    )

});








