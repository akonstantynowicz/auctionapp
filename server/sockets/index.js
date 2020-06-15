const Conversation = require("../model").Conversation;
var ObjectId = require('mongodb').ObjectID;
const Auction = require("../model").Auction;
const User = require("../model").User;

let offers = [];
let messages = [];
let users = [];
let auctions = [];


module.exports = (io) => {

    const auction = io.of("api/auction/");
    const chat = io.of("api/chat");
    
    io.on("connection", (socket) => {
        socket.on("online", (username) => {
            socket.username = username;
            users.push(socket);
            console.log("connected: " + users.length);            
        })
        socket.on("disconnect", () => {
            let mySocket = users.find( x => x.username===socket.username );
            let index = users.indexOf(mySocket);
            users.splice(index, 1);
        })
    })

    auction.on("connection", (socket) => {
        socket.on("joinAuction", (auctionRoom) => {
            Auction.findById(new ObjectId(auctionRoom), (err, result) => {
                if(err) throw err;
                offers = result.offers;
                if(!auctions.some(x => x.key===auctionRoom)){
                    let newAuction = {
                        key: auctionRoom,
                        offers:[]
                    }
                    auctions.push(newAuction);
                }
                socket.join(auctionRoom);
                auction.in(auctionRoom).emit("fetchOffers", {offers, auctionRoom});
            })
        })
        socket.on("sendOffer", (auctionRoom, offer, userId) => {
            let fullOffer = {
                userId,
                newPrice: offer
            }
            let auctionToSave = auctions.find(x => x.key===auctionRoom);
            auctionToSave.offers.push(fullOffer);
            if(auctionToSave.offers.length===1){
                saveToDb(auctionRoom, (fullOffer, result, auctionRoom, error) => {
                    if(error){
                        socket.emit("myerror", error);
                    }else{
                        if(result.offers.some(x => x.userId!==userId)){
                            let notMyOffers = result.offers.filter(x => x.userId!==userId);
                            let usersIds = notMyOffers.map(x => x.userId);
                            let filtered = usersIds.filter((x,i,self) => {
                                return self.indexOf(x)===i;
                            })
                            filtered.forEach(id => {
                                User.findById( new ObjectId(id), (err,result) => {
                                    if(result){
                                        let socketTo = users.find( x => x.username===result.username);
                                        if(socketTo) {
                                            console.log(socketTo);
                                            socketTo.emit("betterOffer","someone made new Offer");
                                        }
                                    }
                                })
                            });
                            
                            
                        }
                        auction.in(auctionRoom).emit("offer", {fullOffer, auctionRoom});
                    }
                });
            }
        })
        socket.on("disconnect", () => {
            socket.removeAllListeners('sendOffer');
            socket.removeAllListeners('disconnect');
            socket.removeAllListeners('joinAuction');
            socket.removeAllListeners('connection');
        })
    });
    
    chat.on("connection", (socket) => {
        socket.on("joinChat", (chatRoom,  userId, username) => {
            Conversation.findById(new ObjectId(chatRoom), (err, result) => {
                if(err) throw err;
                messages = result.messages;
                
                socket.username = username;
                socket.join(chatRoom);
                
                chat.in(chatRoom).emit("fetchMessages", messages);
                let unread = messages.filter( x => x.userId!==userId && !x.seen);
                
                if(unread && unread.length>0){
                    unread.forEach(message => {
                        if(message.userId!==userId){
                            message.seen=true;
                        }
                    });
                    result.save((err, result) => {
                        if (err) throw err;
                        let socketTo = users.find( x => x.username===socket.username);
                        if(socketTo){
                            socketTo.emit("noMessages", "no new messages");    
                        }
                    });
                }
                
                
            })
        })
        socket.on("sendMessage", (chatRoom, msg, username, userId) => {
            let room = chat.adapter.rooms[chatRoom];
            let seen = false;
            if(room && room.length>1){
                seen=true;
            }
            let message = {
                content: msg,
                userId: userId,
                seen: seen,
                date: new Date()
            }
            Conversation.findById(new ObjectId(chatRoom), (err, result) => {
                if(err) throw err;
                result.messages.push(message);
                result.save((err, result) => {
                    if(err) throw err;
                        messages.push(message);
                        chat.in(chatRoom).emit("message", message);
                        let socketTo = users.find( x => x.username===username);
                        if(socketTo){
                            let room = chat.adapter.rooms[chatRoom];
                            if(room && room.length<2){
                                socketTo.emit("newMessage","you have new message");
                            }
                        }
                })
            })
        })
        socket.on("leaveRoom", (chatRoom) => {
            socket.leave(chatRoom);
        })
    });
};

const saveToDb = async (auctionRoom, cb) => {
    let auctionToSave = auctions.find(x => x.key === auctionRoom);
    let fullOffer = null;
    let offer = null;
    while(auctionToSave.offers.length){
        fullOffer = auctionToSave.offers.shift();
        offer=fullOffer.newPrice;
        
        await Auction.findById(new ObjectId(auctionRoom), (err, result) => {
            let myerror="";
            if(err){
                myerror = "błąd w znalezieniu aukcji";
                auctionToSave.offers.shift();
                cb(null, null, myerror);
            }
            else if(new Date(result.endTime) < new Date()){
                result.soldTo = result.offers[result.offers.length-1].userId;
                result.save((err, result) => {
                    if(err){
                        myerror="nieznany błąd";
                        auctionToSave.offers.shift();
                        cb(null, null, myerror);
                    }
                    myerror="aukcja została zakończona!";
                    auctionToSave.offers.shift();
                    cb(null, null, myerror);
                });
    
            }else if(result.soldTo){
                myerror="aukcja została sprzedana";
                auctionToSave.offers.shift();
                cb(null, null, myerror);
            }
            else if(result.price >= offer){
                myerror="oferta musi być wyższa niż ostatnia";
                auctionToSave.offers.shift();
                cb(null, null, myerror);
            }
            else if(result.userId===fullOffer.userId){
                myerror="nie możesz licytować swojej aukcji";
                auctionToSave.offers.shift();
                cb(null, null, myerror);
            }else{
                result.offers.push(fullOffer);
                result.price = fullOffer.newPrice;
                result.save(async (err, res) => {
                    if(err){
                        myerror="błąd zapisu oferty";
                    }else{
                        offers.push(fullOffer);
                    }
                    if(myerror){
                        cb(null, null, myerror);
                    }else{
                        cb(fullOffer, res, auctionRoom, null);
                    }
                })
            }
        })
    }
}
