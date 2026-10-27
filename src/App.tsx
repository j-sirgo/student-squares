import { Barplot } from "./Barplot";
import { data } from "./data";
import "./App.css";

const COURSE_URL = "https://www.react-graph-gallery.com/react-d3-dataviz-course";
const total = data.reduce((s, d) => s + d.students, 0);

function App() {
  return (
    <main>
      <header className="masthead">
        <p className="kicker">
          Student Squares<span className="sep">·</span>Module 1 project
        </p>
        <h1>
          D3 <span className="heart">❤️</span> React Around the World
        </h1>
        <p className="lede">
          Where the first cohort of Yan Holtz&rsquo;s{" "}
          <a href={COURSE_URL} target="_blank" rel="noreferrer">
            D3 ❤️ React
          </a>{" "}
          course logged in from:{" "}
          <strong>
            {total} students across {data.length} countries with three or more
            enrolments
          </strong>
          . Every square is one student, colored by region.
        </p>
      </header>

      <Barplot data={data} />

      <footer className="colophon">
        <p>
          Data from the{" "}
          <a href="https://www.react-graph-gallery.com/" target="_blank" rel="noreferrer">
            React Graph Gallery
          </a>
          .
        </p>
      </footer>
    </main>
  );
}

export default App;
