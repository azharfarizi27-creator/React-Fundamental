import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import "./JobCard.css";

function JobCard({ title, company, location, salary, type }) {
  return (
    <div className="job-card">

      <span className="badge-job">{type}</span>

      <h3>{title}</h3>

      <p>{company}</p>

      <div className="info">
        <FaMapMarkerAlt />
        <span>{location}</span>
      </div>

      <div className="info">
        <FaMoneyBillWave />
        <span>{salary}</span>
      </div>

      <button>Apply Now</button>

    </div>
  );
}

export default JobCard;