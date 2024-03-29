import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import Book, { BookData } from "../../../lib/models/book";


import mongooseInit from "../../../lib/mongooseInit";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  mongooseInit();
  const one: BookData = req.body;
  const found = await Book.find({
    productId: one.productId,
    checkout: { $gt: one.checkin },
    checkin: { $lt: one.checkout }
  })
  const token = await getToken({ req });
  if(found.length>0) {    
    res.status(422).json({result: false});
  }else{
    try {
        if (!token?.email) {
          throw new Error("로그인한 사용자들이 사용할 수 있습니다.");
        }
        //console.log("updateStepData Handle --- ", { ...item, owner: token?.email });
    
        const item: BookData = req.body;
        // console.log("item", item);
        let resultItem:any;
        
        
        if (!item._id) {
          resultItem = await Book.create({ ...item, client: token?.email, reserve:new Date() });
          // console.log(resultItem._id);
          setTimeout(async()=>{
            await Book.deleteOne({_id:resultItem._id,publish:false});
            console.log("deleted");
          },60000*30)
        } else {
          resultItem = await Book.findByIdAndUpdate(item._id, item, {
            returnDocument: "after",
          });
          // console.log(item,resultItem);
        }
        return res.status(200).json({ result: true, data: resultItem });
      } catch (e: any) {
        console.log("updateStepData Handle error --- ", e);
        return res.status(500).json({ result: false, error: e.message });
      }
  }
  
}
