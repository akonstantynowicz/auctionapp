const mongoose = require("../mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("../bcrypt");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true
    },
    auctions: [{
        type: String,
    }],
    conversations: [{
        type: String,
    }]
});

const uniqueValidator = require("mongoose-unique-validator");
userSchema.plugin(uniqueValidator);

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
User.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

const auctionSchema = new Schema({
    userId: {
        type: String,
        required: true        
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAuctionable: {
        type: Boolean,
        required: true
    },
    offers: [{
        userId: {
            type: String
        },
        newPrice: {
            type: Number
        }
    }],
    beginTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    picture: {
        type: String,
        default: "devices.png"
    },
    page: {
        type: Number,
        required: true
    },
    soldTo: {
        type: String,
    }
});

const Auction = mongoose.model("Auction", auctionSchema);

Auction.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};

const conversationSchema = new Schema({
    users: [{
        type: String
    }],
    messages: [{
        content: {
            type: String
        },
        seen: {
            type: Boolean,
            default: false
        },
        userId: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

const Conversation = mongoose.model("Conversation", conversationSchema);
Conversation.processErrors = (err) => {
    let msg = {};
    for (let key in err.errors) {
        msg[key] = err.errors[key].message;
    }
    return msg;
};


module.exports = {
    User: User,
    Auction: Auction,
    Conversation: Conversation
}