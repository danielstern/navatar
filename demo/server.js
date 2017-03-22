const { getNavatarMiddleware } = require('./..');

const express = require(`express`);
const app = new express();

app.use('/avatar/:key.svg',getNavatarMiddleware());
app.use('/',express.static('demo/public'));

const port = process.env.PORT || 7777;
app.listen(port,()=>{
    console.info(`Navatar demo is listening on Port ${port}.`);
});
