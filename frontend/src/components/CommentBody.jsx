import { IoStar } from "react-icons/io5";


export default function CommentBody({ comment }) {
  const cusImg= `http://localhost:8080/api/user/${comment.userId}/image`
  return (
    <div className="comments-div">
      <div style={{display:"flex", gap:"2rem", alignItems:"center"}}>
        <img src={cusImg} alt="img" className="com-dp" />
        <div>
          <div style={{fontSize:"30px", fontWeight:"bolder"}}>{comment.userName}</div>
            <div className="star-select">
              {[1, 2, 3, 4, 5].map((n) => (
                <IoStar
                  key={n}
                  className={n <=  comment.rating? "active-star" : ""}
                />
              ))}  


          </div>
        </div>
      </div>

      <div 
      style={{marginLeft:"6rem", color:"black"}}
      >{comment.desc}</div>

      <div>
        <img />
      </div>
    </div>
  );
}
