'use strict'

const logRequest = require('./logger.js');
const experss = require('express');
const app = experss();


app.use(experss.json());
app.use(logRequest);


module.exports = {
    server: app,
    start: port => {
        let PORT = port || process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`listerning on ${PORT}`));
    }
};





let productDb = [];
let categoryDb = [];


app.get('/products', (req, res) => {
    let outputOfProducts = {
        name: req.query.name,
        display_name: req.query.display_name,
        description: req.query.description
    }
    res.status(200).json(outputOfProducts);
});



app.get('/categories', (req, res) => {
    let outputOfCategory = {
        name: req.query.name,
        display_name: req.query.display_name,
        description: req.query.description
    }
    res.status(200).json(outputOfCategory);
});




app.get('/api/v1/categories/:id', (req, res,next) => {
    let id = req.params.id;
    let record = categoryDb.filter((record)=>record.id === parseInt(id));
    res.json(record)
    let outputOfCategory = {
        name: req.query.name,
        description: req.query.description
    }
    res.status(200).json(outputOfCategory);
});



app.get('/api/v1/products/:id', (req, res,next) => {
    let id = req.params.id;
    let record = productDb.filter((record)=>record.id === parseInt(id));
    res.json(record)
});



app.get('/api/v1/categories', (req, res, next) => {
    let countCatg = categoryDb.length;
    let resultsCatg = categoryDb;
    res.json({ countCatg, resultsCatg });
});



app.get('/api/v1/products', (req, res, next) => {
    let countProd = productDb.length;
    let resultsProd = productDb;
    res.json({ countProd, resultsProd });
});



app.post('/api/v1/products', (req, res, next) => {
    let { name } = req.body;
    let record = { name };
    record.id = productDb.length + 1;
    productDb.push(record);
    res.status(201).json(record);
});



app.post('/api/v1/categories', (req, res, next) => {
    let { name } = req.body;
    let record = { name };
    record.id = categoryDb.length + 1;
    categoryDb.push(record);
    res.status(201).json(record);
});



app.put('/api/v1/categories/:id',(req,res,next)=>{
    let idUpdated = req.params.id;
    let {name, id} = req.body;
    let updatedRecord = {name, id};
    categoryDb = categoryDb.map((record)=>(record.id === parseInt(idUpdated) ? updatedRecord : record));
    res.json(updatedRecord);
});



app.put('/api/v1/products/:id',(req,res,next)=>{
    let idUpdated = req.params.id;
    let {name, id} = req.body;
    let updatedRecordProd = {name, id};
    productDb = productDb.map((record)=>(record.id === parseInt(idUpdated) ? updatedRecord : record));
    res.json(updatedRecordProd);
});



app.delete('/api/v1/categories/:id',(req,res,next)=>{
    let id = req.params.id;
    categoryDb=categoryDb.filter((record)=>record.id !==parseInt(id));
    res.json({msg:"item deleted"})
});



app.delete('/api/v1/products/:id',(req,res,next)=>{
    let id = req.params.id;
    productDb=productDb.filter((record)=>record.id !==parseInt(id));
    res.json({msgProd:"item deleted"})
});

function hanlderError(err, req, res, next) {
    res.status(500);
    res.message = 'Server Error';
    res.json({ error: err });
};


function notFoundHandler(req, res, next) {
    res.status(404);
    res.message = 'Not FOUND!!';
    res.json({ error: "Not FOUND!!" })
};


app.get('/error',hanlderError)
app.get('/real-error',(req,res)=>{
    throw new Error('SORY YOU HAVE AN ERROR!!')
});