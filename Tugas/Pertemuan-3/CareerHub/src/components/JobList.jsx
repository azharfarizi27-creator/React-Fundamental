import jobs from "../data/jobs";
import JobCard from "./JobCard";

function JobList() {
  return (
    <section
      style={{
        padding: "80px 8%",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "35px",
        }}
      >
        Lowongan Terbaru
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "25px",
        }}
      >
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            type={job.type}
          />
        ))}
      </div>
    </section>
  );
}

export default JobList;