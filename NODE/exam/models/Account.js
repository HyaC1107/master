const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({    
    email:{type:String,required:true},
    password:{type:String, required:true}
},{
    toObject:{virtuals: true}
});

accountSchema.virtual("key",{
    localField:"_id",
    ref: "expend",
    foreignField:"userId"
});



module.exports = mongoose.model("account",accountSchema);