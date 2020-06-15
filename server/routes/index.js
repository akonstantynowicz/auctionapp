"use strict";

const rejectMethod = (_req, res, _next) => {
    res.sendStatus(405);
};

const updateAuctions = (auctions) => {
    let offers;
    for (let i=0; i<auctions.length; i++){
        offers = auctions[i].offers;
        auctions[i].soldTo = auctions[i].offers[offers.length-1].userId;
        auctions[i].save();
    }
}

const express = require("express");
const router = express.Router();

const passport = require("../passport");
const bcrypt = require("../bcrypt");
var ObjectId = require('mongodb').ObjectID;

const User = require("../model").User;
const Auction = require("../model").Auction;
const Conversation = require("../model").Conversation;

router.route("/")
    .get(async (req, res) => {
        let newMessages = 0;
        if(req.isAuthenticated()){
            let conversations = await Conversation.find({users: req.user.id});
            conversations.forEach(conv => {
                if(conv.messages.some(x => x.userId!=req.user.id && !x.seen)){
                    newMessages++;
                }
            });
            
        }
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            newMessages
        });
    })
    .all(rejectMethod);

router.route("/auctions")
    .get(async (req, res) => {
        let page = req.query.page;        
        if(page==="0"){
            let lastAuction = await Auction.find().sort({page: -1}).limit(1);
            if(lastAuction[0].page){
                page = lastAuction[0].page;
            }else{
                page = 1;
            }
        }
        let today = new Date().toISOString();
        let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
        updateAuctions(auctionsToUpdate);
        let auctions = await Auction.find({page: page, beginTime: { $lte: today }, endTime: { $gt: today}, soldTo: null});
        res.json({
            auctions: auctions,
            page: page
        });
    })
    .post(async(req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "zaloguj się!"
            })
        }else{
            if(req.body.itemName && req.body.description && req.body.price &&
                req.body.auctionable!==null && req.body.begin && req.body.beginTime &&
                req.body.end && req.body.endTime && req.body.picture){
                let page = -1;
                let lastAuction = await Auction.find().sort({page: -1}).limit(1);
                
                if(lastAuction[0].page){
                    let lastAuctions = await Auction.find({page: lastAuction[0].page});
                    if(lastAuctions.length<5){
                        page = lastAuction[0].page;
                    }else{
                        page = lastAuction[0].page + 1;
                    }
                }else{
                    page = 1;
                }
                let user = await User.findOne({ username: req.user.username });
                let beginDate = new Date(req.body.begin + " " + req.body.beginTime);
                let endDate = new Date(req.body.end + " " + req.body.endTime);
                if(beginDate>=endDate){
                    return res.status(400).json({
                        message: "data rozpoczęcia musi być wcześniejsza niż zakończenia"
                    });
                }
                let auction = new Auction({
                    userId: req.user.id,
                    itemName: req.body.itemName,
                    description: req.body.description,
                    price: req.body.price,
                    isAuctionable: req.body.auctionable,
                    beginTime: beginDate,
                    endTime: endDate,
                    picture: req.body.picture,
                    page: page
                });
                await auction.save();
                user.auctions.push(auction._id);
                await user.save();
                res.json({
                    msg: "dodano aukcję",
                    auction
                });
            }else{
                res.status(400).json({
                    message: "uzupełnij wszystkie pola"
                });
            }
        }
    })
    .patch(async(req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "zaloguj się!"
            })
        }else{
            if(req.body.itemName && req.body.description && req.body.price &&
                req.body.auctionable!==null && req.body.begin && req.body.beginTime &&
                req.body.end && req.body.endTime && req.body.picture){

                let beginDate = new Date(req.body.begin + " " + req.body.beginTime);
                let endDate = new Date(req.body.end + " " + req.body.endTime);

                if(beginDate>=endDate){
                    return res.status(400).json({
                        message: "data rozpoczęcia musi być wcześniejsza niż zakończenia"
                    })
                }

                if(new Date(req.body.oldBegin)<new Date()){
                    return res.status(400).json({
                        message: "aukcja trwa, nie można edytować"
                    })
                }
                let auction = await Auction.findById(new ObjectId(req.body.auctionId));
                if(!auction){
                    return res.status(400).json({
                        message: "nie ma takiej aukcji"
                    })
                }else{
                    let user = await User.findOne({auctions: req.body.auctionId});
                    if(user.username!==req.user.username){
                        return res.status(400).json({
                            message: "to nie Twoja aukcja"
                        })
                    }
                }

                auction.itemName = req.body.itemName;
                auction.description = req.body.description;
                auction.price = req.body.price;
                auction.isAuctionable = req.body.auctionable;
                auction.beginTime = beginDate;
                auction.endTime = endDate;
                auction.picture = req.body.picture;
                await auction.save();

                res.json({
                    msg: "pomyslnie zedytowano",
                    auction
                });
            }else{
                res.status(400).json({
                    message: "uzupełnij wszystkie pola!"
                });
            }
        }
    })
    .all(rejectMethod);

    router.route("/auctions/bought")
    .get(async (req,res) => {
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message: "zaloguj się!"
            });
        }
        let today = new Date().toISOString();
        let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
        updateAuctions(auctionsToUpdate);

        let auctions = await Auction.find({soldTo: req.user.id});

        res.json({
            auctions
        });
    })

    router.route("/auctions/yours")
    .get(async (req,res) => {
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message: "zaloguj się!"
            });
        }
        let today = new Date().toISOString();
        let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
        updateAuctions(auctionsToUpdate);

        let auctions = await Auction.find({userId: req.user.id, $or: [ {endTime: {$lt: today}}, { soldTo: {$ne: null}} ] });

        res.json({
            auctions
        });
    })

    router.route("/auctions/current")
    .get(async (req,res) => {
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message: "zaloguj się!"
            });
        }
        let today = new Date().toISOString();
        let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
        updateAuctions(auctionsToUpdate);

        let auctions = await Auction.find({userId: req.user.id, $and: [ {endTime: {$gte: today}}, { soldTo: null} ]});

        res.json({
            auctions
        });
    })

    router.route("/auction/:id")
    .get(async (req, res) => {
        try {
            let today = new Date().toISOString();
            let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
            await updateAuctions(auctionsToUpdate);
            
            let auction = await Auction.findById(new ObjectId(req.params.id));
            let user = await User.findOne({ auctions: req.params.id});
            res.json({
                auction: auction,
                params: req.params,
                username: user.username,
                isAuthenticated: req.isAuthenticated(),
                user: req.user
            });
        } catch (error) {
            res.status(400).json({
                message: "wystąpił błąd"
            });
        }
    })
    .patch(async (req, res) => {
        try {
            if(!req.isAuthenticated()){
                return res.status(400).json({
                    message: "zaloguj się"
                }); 
            }

            let auction = await Auction.findById(new ObjectId(req.params.id));
            if(auction.soldTo){
                return res.status(400).json({
                    message: "ten przedmiot został już sprzedany"
                }); 
            }

            if(auction.userId===req.user.id){
                return res.status(400).json({
                    message: "nie możesz kupić swojego przedmiotu"
                });
            }
            auction.soldTo = req.user.id;
            await auction.save();
            res.json({
                auction
            });
        } catch (error) {            
            return res.status(400).json({
                message: "nieznany błąd"
            });
        }
    })
    .all(rejectMethod);

router.route("/login")
    .post((req, res, next) => { 
        console.log("login");
               
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(400).json({
                message: "niepoprawne dane"
            });
          }
          req.login(user, err => {
            res.send(user);
          });
        })(req, res, next);
      })
    .all(rejectMethod);

router.route("/logout")
    .get((req, res) => {
        req.logout();
        res.json({
            msg: "logged out"
        });
    })
    .all(rejectMethod);

router.route("/register")
    .post(async (req, res) => {
        try {
            let passwordHash = bcrypt.hash(req.body.password);
            let user = new User({
                email: req.body.email,
                username: req.body.username,
                password: passwordHash
            });
                let doc = await user.save();
            res.json({
                doc
            });
        } catch (err) {
            if (!req.body.password) {
                res.status(422).json({
                    message: "hasło nie może być puste"
                });
            } else {
                res.status(422).json({
                    message: "nazwa użytkownika jest nieprawidłowa lub zajęta"
                });
            }
        }
    })
    .all(rejectMethod);

    router.route("/account")
    .get((req, res) => {
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    })
    .patch(async(req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "nie jesteś zalogowany"
            })
        }else{
            let user = await User.findOne({ username: req.user.username });
            let userTaken;
            if(req.user.username!=req.body.username){
                userTaken = await User.findOne({ username: req.body.username });
            }
            if(!userTaken && user){
                if(req.body.username){
                    user.username = req.body.username;
                }
                if(req.body.email){
                    user.email = req.body.email;
                }
                if(req.body.password){
                    user.password = bcrypt.hash(req.body.password);
                }
                await user.save();
                res.json({
                    msg: "pomyślnie zmieniono dane",
                    user: user
                });
            }else if(userTaken){
                res.status(400).json({
                    message: "użytkownik o takiej nazwie już istnieje, wybierz inną"
                });
            }else{
                res.status(400).json({
                    message: "błąd połączenia"
                });  
            }
            
        }
    })
    .all(rejectMethod);

    router.route("/conversation")
    .get(async (req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "zaloguj sie!"
            })
        }else{
            let conversation = null;
            let toUsername = req.query.toUser;        
            let currentUser = req.user;
            if(toUsername){
                let toUser = await User.findOne({username: toUsername});
                if(toUser){
                    conversation = await Conversation.findOne({users: { $all : [toUser._id, currentUser.id]}});
                }
            }
            
            res.json({
                conversation: conversation
            });
        }
    })
    .post(async (req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "zaloguj sie!"
            })
        }else{
            let conversation;
            let toUsername = req.body.toUser;
            let msg = req.body.message;        
            if(toUsername){
                let toUser = await User.findOne({username: toUsername});
                if(toUser){
                    conversation = new Conversation ({
                        users: [
                            req.user.id,
                            toUser._id
                        ],
                        messages: [
                        ]
                    })
                    let message = ({
                            content: msg,
                            seen: false,
                            userId: req.user.id,
                            date: new Date()
                    })

                    conversation.messages.push(message);
                    await conversation.save();
                    toUser.conversations.push(conversation._id);
                    toUser.save();
                    let fromUser = await User.findOne({username: req.user.username});
                    fromUser.conversations.push(conversation._id);
                    fromUser.save();
                }
            }
            res.json({
                conversation
            });
        }
    })
    .all(rejectMethod);

    router.route("/conversation/:id")
    .get(async (req, res) => {
        try {
            let unread=false;
            if(!req.isAuthenticated()){
                throw new Error("zaloguj się");
            }
            let conversation = await Conversation.findById(new ObjectId(req.params.id));
            let users = await User.find({ conversations: conversation._id});
            let username;
            if(users[0].username===req.user.username){
                username=users[1].username;
            }else{
                username=users[0].username;
            }
            if(conversation.messages.some(x => x.userId!=req.user.id && !x.seen)){
                unread=true;
            }   
            res.json({
                username,
                user: req.user,
                unread
            });
        } catch (error) {            
            res.status(400).json({
                message: "zaloguj się!"
            });
        }
    })
    .all(rejectMethod);

    router.route("/conversations")
    .get(async (req, res) => {
        if(!req.isAuthenticated()){
            res.status(400).json({
                message: "zaloguj się!"
            });
        }
        let conversations = await Conversation.find({users: req.user.id});
        res.json({
            conversations
        });
    })
    .all(rejectMethod);

    router.route("/editAuctions")
    .get(async (req, res) => {
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message: "zaloguj się"
            }); 
        }
        let today = new Date().toISOString();
        let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
        await updateAuctions(auctionsToUpdate);
        let auctions = await Auction.find({username: req.user.username, beginTime: { $gt: today }});
        res.json({
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            auctions: auctions
        });
    })
    .all(rejectMethod);

    router.route("/historicalAuctions")
    .get(async (req, res) => {
        if(!req.isAuthenticated()){
            return res.status(400).json({
                message: "zaloguj się"
            }); 
        }
        try {
            let today = new Date().toISOString();
            let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
            await updateAuctions(auctionsToUpdate);
            let auctions = await Auction.find({ $or: [ { userId: req.user.id }, { soldTo: req.user.id } ] });
            res.json({
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                auctions: auctions
            }); 
        }catch(error){
            return res.status(400).json({
                message: "zaloguj się"
            }); 
        }
    })
    .all(rejectMethod);
    
    router.route("/auctions/participating")
    .get(async (req, res) => {
        if(!req.isAuthenticated()){            
            return res.status(400).json({
                message: "zaloguj się"
            }); 
        }
        try {
            let today = new Date().toISOString();
            let auctionsToUpdate = await Auction.find({isAuctionable: true, endTime: { $lt: today}})
            await updateAuctions(auctionsToUpdate);
            let auctions = await Auction.find({ "offers.userId": req.user.id, soldTo: null});
            res.json({
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                auctions: auctions
            }); 
        }catch(error){
            return res.status(400).json({
                message: "błąd przetwarzania danych"
            }); 
        }
    })
    .all(rejectMethod);

module.exports = router;