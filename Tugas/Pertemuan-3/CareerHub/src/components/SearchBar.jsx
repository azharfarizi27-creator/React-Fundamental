import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar() {
  return (
    <section className="search-section">
      <div className="search-box">
        <div className="input-group">
          <FaSearch />
          <input
            type="text"
            placeholder="Cari posisi pekerjaan..."
          />
        </div>

        <div className="input-group">
          <FaMapMarkerAlt />
          <input
            type="text"
            placeholder="Lokasi"
          />
        </div>

        <button>Cari</button>
      </div>
    </section>
  );
}

export default SearchBar;