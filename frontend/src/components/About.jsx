import officeImg from "../assets/office.jpg"
import '../styles/about.css'
export default function About() {
    return (
        <div className="about-div reveal">
                <img src={officeImg} className="about-img"/>
                <div className="about-info">
                    <h1 style={{color:"#6b1d4d", fontSize:"80px"}}>Who we are</h1>
                    <p>
                        Mercato was built with a simple idea — make quality shopping effortless.
                        <br/>
                        We curate products across fashion, electronics, and everyday essentials, focusing on quality, value, and reliability. Every item on Mercato is carefully selected to meet modern lifestyle needs without unnecessary complexity.
                        <br/>
                        From seamless browsing to secure payments and fast delivery, we’re committed to creating a shopping experience you can trust. Whether you’re upgrading your wardrobe or finding everyday essentials, Mercato is designed to deliver style, convenience, and confidence — all in one place.
                    </p>
                </div>
        </div>
    );
}