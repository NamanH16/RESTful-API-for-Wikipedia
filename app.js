const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));
 
async function main() {
   mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
};

// create schema
const articleSchema = {
    title: String,
    content: String
};

// create model
const article = mongoose.model("article",articleSchema);

//////////////////////////REQUESTS TARGETTING ALL ARTICLES/////////////////////

app.route("/articles")
    .get((req,res)=>{
        article.find(function(err,foundArticles){
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
        });
    })

    .post((req,res)=>{
        const newArticle = new article({
            title: req.body.title,
            content:req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added a new article.");
            }else{
                res.send(err);
            }
        });
    })

    .delete((req,res)=>{
        article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles.");
            }else{
                res.send(err);
            }
        });
    });

//////////////////////////////////////REQUESTS TARGETTING A SPECIFIC ARTICLES/////////////////////
app.route("/articles/:articleTitle")
    .get(function(req,res){
        article.findOne({title:req.params.articleTitle},function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No Articles matching that title was found");
            }
        });
    })

    .put(function(req,res){
        article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }else{
                    res.send(err);
                }
            }
        );
    })

    .patch(function(req,res){
        article.updateOne(
            {title:req.params.articleTitle},
            {$set:req.body}, //allows the user which field he wants to update, i.e. either title or content 
            function(err){
                if(!err){
                    res.send("Successfully update article.");
                }else{
                    res.send(err);
                }
            }
        );  
    })

    .delete(function(req,res){
        article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted article");
                }else{
                    res.send(err);
                }
            }
        );
    });

app.listen(3000, function() {
    console.log("Server started on port 3000.");  
});