const express = require('express');
const fs = require('fs');
const shortener = require('./urlShortener.js');
const app = express();

let urlData = undefined;
function read(path, callback) {
    fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                callback(err);
            }
            urlData = JSON.parse(data);
            callback();
        });
} 

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    console.log(JSON.stringify(req.query));
    next();
});

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    // first time accessing dataset
    if (urlData == undefined) {
        read('./data/urldata.json', (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                const highest = [...urlData].sort( (x,y) => x.clickCount - y.clickCount).slice(0,5);
                res.render('trending', {names: highest}); 
            }
        });
    }
    else { // dataset has been accessed before
        const highest = [...urlData].sort( (x,y) => x.clickCount - y.clickCount).slice(0,5);
        res.render('trending', {names: highest}); 
    }
});

app.get('/trending', (req,res) => {
    res.redirect('/');
});

app.post('/shorten', (req, res) => {
    if (urlData == undefined) { // first time shortening a url
        read('./data/urldata.json', (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                const newShort = new shortener.URLShortener(req.body.original, urlData);
                // url is already in dataset
                if (urlData.filter( x => x.originalURL === newShort.originalURL).length > 0) {
                    newShort.updateClickCount();
                    let temp = urlData.filter( x => x.originalURL === newShort.originalURL);
                    temp[0].clickCount += 1;
                    fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                        if (err) throw err;
                        console.log('Updated click count of url');
                    });
                    res.render('shorten', {short: temp[0].shortURL});                    
                }
                else { // new url given to be added to dataset
                    const tempShort = newShort.shorten();
                    urlData.push({originalURL: newShort.originalURL, shortURL: tempShort, clickCount: newShort.clickCount});
                    fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                        if (err) throw err;
                        console.log('Updated URL dataset with new url');
                    });                         
                    res.render('shorten', {short: tempShort});
                }
            }
        });
    }
    else {
        const newShort = new shortener.URLShortener(req.body.original, urlData);
        // url given is already in dataset
        if (urlData.filter( x => x.originalURL === newShort.originalURL).length > 0) {
            newShort.updateClickCount();
            let temp = urlData.filter( x => x.originalURL === newShort.originalURL);
            temp[0].clickCount += 1;
            fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                if (err) throw err;
                console.log('Updated click count of url');
            });
            res.render('shorten', {short: temp[0].shortURL});
        }
        else { // new url given by user
            const tempShort = newShort.shorten();
            urlData.push({originalURL: newShort.originalURL, shortURL: tempShort, clickCount: newShort.clickCount});    
            fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                if (err) throw err;
                console.log('Updated URL dataset with new url');
            })            
            res.render('shorten', {short: tempShort});
        }
    }
    
});

app.get('/shorten', (req, res) => {
    res.render('shorten');
});

app.get('/expand', (req, res) => {
    // first time accessing dataset
    if (urlData == undefined) {
        read('./data/urldata.json', (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                // long url is found in dataset based off given short url
                if (urlData.filter( x => x.shortURL === req.query.long).length > 0) {
                    let temp = urlData.filter( x => x.shortURL === req.query.long);
                    temp[0].clickCount += 1;
                    fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                        if (err) throw err;
                        console.log('Updated click count of url');
                    });
                    res.render('expand', {long: temp[0].originalURL});
                }
                else { // short url given is not availble in dataset to be expanded
                    res.render('expand');
                }
            }
        });
    }
    else { // dataset has already been saved
        // long url is found in dataset based off given short url
        if (urlData.filter( x => x.shortURL === req.query.long).length > 0) {
            let temp = urlData.filter( x => x.shortURL === req.query.long);
            temp[0].clickCount += 1;
            fs.writeFile('./data/urldata.json', JSON.stringify(urlData), function(err) {
                if (err) throw err;
                console.log('Updated click count of url');
            });
            res.render('expand', {long: temp[0].originalURL});
        }
        else { // short url given is not availble in dataset to be expanded
            res.render('expand');
        }
    }
});

app.listen(3000);
console.log("Server started; type CTRL+C to shut down");