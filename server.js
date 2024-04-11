/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Ziyang Wang Student ID: 154296222 Date: Feb 15,2024
*
********************************************************************************/
const legoData = require("./modules/legoSets");
const express = require('express'); 
const app = express(); // obtain the "app" object
app.use(express.static('public'));
const path = require('path');
app.set('view engine','ejs');
const HTTP_PORT = process.env.PORT || 8080; 
legoData.initialize();
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
app.use(express.urlencoded({ extended: true }));


app.get('/about', (req, res) => {
   res.render("about");
});

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { themes: themes });
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(500).render("500", { message: "Error" });
    }
});


app.post('/lego/addSet', async (req, res) => {
    try {
        let setData = req.body;
        await legoData.addSet(setData);
        res.redirect('/lego/sets');
    } catch (err) {
        console.error("Error: " + err.message);
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
});

app.get('/lego/editSet/:num', async (req, res) => {
    try {
        const setNum = req.params.num;
        const set = await legoData.getSetByNum(setNum);
        const themes = await legoData.getAllThemes();
        if(set){
        res.render("editSet", { set: set, themes: themes });
        }
        else{
            res.status(404).render("404", {message: "Sorry, we're unable to find request set"}); 
        }
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(404).render("404", { message: err.message });
    }
});

app.post('/lego/editSet', async (req, res) => {
    try {
        let { set_num, ...setData } = req.body;
        await legoData.editSet(set_num, setData);
        res.redirect('/lego/sets');
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
    try {
        const setNum = req.params.num;
        await legoData.deleteSet(setNum);
        res.redirect('/lego/sets');
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(500).render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    }
});

app.get('/lego/sets/:setNum', async (req, res) => {
    try {
        const setNum = req.params.setNum;
        const foundWithNum = await legoData.getSetByNum(setNum);
        if (foundWithNum) {
            res.render("set", { set: foundWithNum }); 
        } else {
            res.status(404).render("404", {message: "Sorry, we're unable to find request set"});
        }
    } catch (err) {
        console.error("Error: " + err.message);
        res.status(404).render("404", {message: "Sorry, we're unable to find request set"});
    }
});


app.get('/lego/sets', async (req, res) => {
    try {
        let sets;
        if (req.query.theme) {
            sets = await legoData.getSetsByTheme(req.query.theme);
        } else {
            sets = await legoData.getAllSets();
        }
        if (sets.length > 0) {
            res.render("sets", { sets: sets });
        } else {
            res.status(404).render("404", {message: "Sorry, we're unable to find request theme"});
        }
    } catch (err) {
        console.log("Error:", err.message);
        res.status(404).render("404", {message: "Sorry, we're unable to find request theme"});
    }
});

app.get("/lego/sets", async (req,res)=>{
    let legoSets = await legoData.getAllSets();
    res.render("sets", {sets: legoSets});
  });

  
app.get('*', (req, res) => {
    res.status(404).render("404", { message: "Sorry, we're unable to find what you're looking for" });
});

  