const express = require("express");
const app = express();
const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios");

//initializing sequelize object to connect with Postgresql Database
const psql = "postgres://postgres:postgres@localhost:5432/salah"
const sequelize = new Sequelize(psql, {});

//API URL ( get top 5 books for all the best sellers lists )
const apiUrl = 'https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=dfCTQmcAYXGiqaB0HxUr4ItRzc3Kyb6P';

//start function .. to start the app
const start = (port) => {
    app.listen(port, () => {
        console.log(`********************Server running on port: ${port}****************************`);
    })
};

//defining Publisher schema to be implemented in the database
const Publisher = sequelize.define('publisher', {
    name: {
        type: DataTypes.STRING

    }
}, { timestamps: false });

//defining books schema to be implemented in the database
const Books = sequelize.define('book', {
    title: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
}, { timestamps: false });

//defining realtionship between books and publishers( one publisher has many books )
Publisher.hasMany(Books);
Books.belongsTo(Publisher);

//connecting to database and start the app and then call the api using axios library
sequelize.sync({ force: true }).then(() => {
    console.log(`********************Database Connected Successfuly****************************`);
    start(3001);
}).then(async () => {

    //calling the api
    await axios.get(apiUrl).then(
        (res) => {
            //in order to reach to actual data that we need, 
            //we have to call res.data.result.lists where it is the structure of the json response 
            if (res.data.status === "OK") {
                res.data.results.lists.map(async (elem) => {
                    const pub = await Publisher.create({
                        name: elem.list_name
                    })
                    const books = await Books.bulkCreate(elem.books)
                    pub.addBooks(books);
                })
            } else {
                console.log("Error, Cannot call the API");
            }
        }
    )

});