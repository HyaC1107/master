const express = require("express");
const router = express.Router();

const Room = require("../models/Room");
const Message = require("../models/Message");

const clients = new Set();

router.use((req,resp,next)=>{
    if(req.session.auth){
        next();
    }else{
        return resp.redirect("/account/signin");
    }
});

//======================================================
router.ws("/sse",(ws,req)=>{
    // 클라이언트쪽에서 웹소켓 연결이 일어났을때 작동함.
    console.log(req.originalUrl +" connected by " + req.session.id);
    clients.add(ws);
    ws.on("close",()=>{
        console.log("closed...");
        clients.delete(ws);
    });
});

const roomWss = new Map();
router.ws("/room",(ws,req)=>{
    console.log("ws://~room " + req.query._id, );    
    roomWss.set(req.session.userId, ws);  // Map 에 데이터 저장(Key, value)
    // console.log(roomWss);
    ws.on("close",()=>{
        roomWss.delete(ws);
    });
});
//======================================================
router.get("/",async(req,resp)=>{
    const rooms = await Room.find({}).sort("-createdAt").lean();
    const joinRooms = await Room.find({joiner:req.session.userId}).sort("-createdAt").lean();
    const unJoinRooms = await Room.find({joiner:{$ne: req.session.userId}}).sort("-createdAt").lean();
    //console.table(rooms);
    resp.locals.rooms = rooms;
    resp.locals.joinRooms = joinRooms;
    resp.locals.unJoinRooms = unJoinRooms;
    resp.render("chats/index");
});

router.route("/open")
    .get((req,resp)=>{
        resp.render("chats/open");
        //console.log(wsInstance);
    })
    .post(async(req,resp)=>{
        //body 안에 title, type, password란 이름으로 데이터가 있다고 가정
        let data= {...req.body, owner: req.session.userId};
        let result = await Room.create(data);    
        // console.log(result);
       
        clients.forEach((ws) => {
            ws.send(JSON.stringify({"type":"new"}));
        });

        resp.redirect("/chats/room?_id="+result._id);
    });
router.route("/exit")
    .get(async(req,resp)=>{
        let roomId = req.query._id;
        await Room.updateOne({_id:roomId},{$pull:{joiner:req.session.userId}});
        const room = await Room.findOne({_id : req.query._id});

        roomWss.forEach((ws)=>{            
            ws.send(JSON.stringify({
                apply:roomId ,type:"exit", id:req.session.userId, joiner: room.joiner
            }));            
        });
        resp.redirect("/chats");
    });
router.get("/room",async(req,resp)=>{      
    // console.log(newJoin);
    // find로 찾으면 배열로 나오고, findOne은 객체로 나온다.
    // const room = await Room.findByIdAndUpdate(roomId,{$addToSet:{joiner:newJoin}},{returnDocument:"after"});
    await Room.updateOne({_id : req.query._id}, { $addToSet: { joiner: req.session.userId } });
    const room = await Room.findOne({_id : req.query._id});     // Room.findById(req.query._id);
    
    const message = await Message.find({roomId:req.query._id}).sort("createdAt").lean();
    // console.log(message);
    //resp.locals.message = message;

    resp.locals.room = room;
    resp.locals.message = message.map((one)=>{
        return {...one, type: one.talker == req.session.userId ? "mine" : "other"}
    });

    roomWss.forEach((ws)=>{            
        ws.send(JSON.stringify({
            apply:req.query._id ,type:"join", id:req.session.userId, joiner: room.joiner
        }));            
    });
    

    resp.render("chats/room");
});

// 채팅 룸에서 발생한 ajax요청을 처리할 곳
router.post("/api/message",async (req,resp)=>{
    // req.body에 roomId랑, talker, comment가 왔다는 조건 하에
    try{
        let result = await Message.create({ ...req.body, talker: req.session.userId });
        
        // console.log(result instanceof Message);
        
        result = result.toObject();
       
        roomWss.forEach((ws, ownerId )=>{
            result.type = result.talker === ownerId ? "mine" : "other";
            ws.send(JSON.stringify({apply : req.body.roomId, type:"new", data : result}));
        });
        resp.json({ "success": true, "result": result });
    }catch(err){
        resp.json({"success" : false,"error":err.message});
    };
});





    
module.exports = router;
