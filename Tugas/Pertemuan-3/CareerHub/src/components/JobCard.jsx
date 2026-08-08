import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import "./JobCard.css";

function JobCard({ title, company, location, salary, type }) {
  return (
    <div className="job-card">

      <span className="inline-block bg-amber-500 text-white rounded-full">{type}</span>

      <h3 className="bg-lightblue text-dark p-4 shadow-md">{title}</h3>

      <p className="font-semibold mask-b-from-neutral-50">{company}</p>

      <div className="info">
        <FaMapMarkerAlt />
        <span>{location}</span>
      </div>

      <div className="info">
        <FaMoneyBillWave />
        <span className=" text-green-600">{salary}</span>
      </div>

      <button>Apply Now</button>

    </div>
  );
}

export default JobCard;