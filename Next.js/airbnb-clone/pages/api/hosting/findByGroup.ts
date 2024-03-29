import { NextApiHandler } from "next";
import { HostingData } from "../../../interface/hosting";
import Property from "../../../lib/models/property";
import mongooseInit from "../../../lib/mongooseInit";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ result: false, message: "요청을 처리할 수 없습니다." });
    }
    try {
        mongooseInit();
        const document = req.body;
        console.log(document);        
        const find = await Property.find({ group: "아파트" });
        console.log("find",find);
        if(find){
          return res.status(201).json({
            result: true, type: true
          });
        } else {
          return res.status(201).json({ 
            result: true, type: false
          });
        }
        
      } catch (e: any) {
        return res.status(201).json({
          result: false,
          message: e.message
        });
      }
    
   
  
};

export default handler;
