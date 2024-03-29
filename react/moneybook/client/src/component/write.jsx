import { useRef } from "react";

function Write({historyAPI,setAdded}) {
    const cateogries = ["미분류","식비","주거/통신","생활용품","의복/미용","교통/차량","용돈/기타"];
    
    const itemDate = useRef();
    const useDesc = useRef();
    const cashAmt = useRef();
    const cardAmt = useRef();
    const category = useRef();
    const tag = useRef();
    

    const handleSubmit = (event) =>{    
        event.preventDefault();
        historyAPI.write(itemDate.current.value,useDesc.current.value,cashAmt.current.value,cardAmt.current.value,category.current.value,tag.current.value)
            .then(recv =>{
                setAdded(recv._id);
                console.log(recv);
            })
        event.target.reset();   
    }

    

    return (
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-body">
            <h2>소비내역 기입</h2>
            <form onSubmit={handleSubmit}>                
                <div className="form-floating mb-3 mt-3">
                    <input type="date" className="form-control" id="itemDate" ref={itemDate}/>
                    <label htmlFor="itemDate">소비날짜</label>
                </div> 
                <div className="form-floating mb-3 mt-3">
                    <input type="text" className="form-control" id="useDesc" ref={useDesc} required/>
                    <label htmlFor="useDesc">사용내역</label>
                </div> 
                <div className="row g-2">
                    <div className="col-md">
                        <div className="form-floating mb-3">
                            <input type="number" className="form-control" id="cashAmt" ref={cashAmt} defaultValue="0"/>
                            <label htmlFor="cashAmt">현금</label>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating mb-3 ">
                            <input type="number" className="form-control" id="cardAmt" ref={cardAmt} defaultValue="0"/>
                            <label htmlFor="cardAmt">카드</label>
                        </div> 
                    </div> 
                </div>
                <div className="form-floating mb-3 mt-3">
                    <select type="text" className="form-control" id="category" ref={category}>
                        {cateogries.map(one=>{
                            return <option value={one} key={one}>{one}</option>
                        })}                
                    </select>
                    <label htmlFor="category">카테고리</label>
                </div> 
                <div className="form-floating mb-3 mt-3">
                    <input type="text" className="form-control" id="tag" ref={tag}/>
                    <label htmlFor="tag">태그</label>
                </div> 
                <div className="modal-footer">
                    <button className="btn btn-dark" data-bs-dismiss="modal">등록</button>
                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal">취소</button>
                </div>
            </form> 
            </div>
        </div>
    </div> );
}

export default Write;