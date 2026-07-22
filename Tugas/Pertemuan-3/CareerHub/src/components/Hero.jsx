import { FaSearch } from "react-icons/fa";
import "./Hero.css";
import heroImage from "../assets/hero-img.png";


function Hero() {
    return (
        <section className="hero">

            <div className="hero-left">

                <span className="badge"> #1 Job Portal Indonesia</span>

                <h1>
                    Temukan <span>Karier Impianmu</span> Bersama CareerHub
                </h1>

                <p>
                    Jelajahi ribuan lowongan kerja dari perusahaan terpercaya
                    dan bangun masa depan kariermu mulai hari ini.
                </p>

                <button>
                    <FaSearch />
                    Cari Pekerjaan
                </button>

            </div>

            <div className="hero-right">

                <img src={heroImage} alt="Hero Illustration" />

            </div>

        </section>
    );
}

export default Hero;