import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Label } from "semantic-ui-react";
import ReactPlayer from "react-player";
import { fetchLectures } from "../../Store/Actions/lecturesActions";
import {
  lighterBlue,
  anotherBlue,
  darkBlack,
} from "../../Helpers/Colors/colors";
import { RootState } from "../../types";

const Lectures: React.FC = () => {
  const dispatch = useDispatch();
  const lectures = useSelector(
    (state: RootState) => state.lecturesReducer.lectures,
  );
  const loading = useSelector(
    (state: RootState) => state.lecturesReducer.loading,
  );

  const [selectedLecture, setSelectedLecture] = useState({
    url: "",
    title: "Select a lecture to begin",
  });

  useEffect(() => {
    dispatch(fetchLectures() as any);
  }, [dispatch]);

  useEffect(() => {
    if (lectures.length > 0 && !selectedLecture.url) {
      setSelectedLecture({
        url: lectures[0].url,
        title: lectures[0].title,
      });
    }
  }, [lectures, selectedLecture.url]);

  const changeURL = (url: string, title: string) => () => {
    setSelectedLecture({ url, title });
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          color: lighterBlue,
        }}
      >
        Loading lectures...
      </div>
    );
  }

  return (
    <Container>
      <div className="lectures">
        {/* First column - Lecture List */}
        <div style={{ color: lighterBlue }}>
          <p>
            Here are my lectures from when I was a teaching assistant at Lambda
            School Academy of Computer Science. This experience allowed me to
            dive deeper into the concepts and help other developers learn.
          </p>
          <Label
            style={{
              background: darkBlack,
              border: `1px solid ${lighterBlue}`,
              color: anotherBlue,
            }}
          >
            Click a title below to watch the video
          </Label>
          <ul>
            {lectures.map((lecture, index) => (
              <li
                style={{
                  cursor: "pointer",
                  marginBottom: "20px",
                  padding: "10px",
                  borderRadius: "4px",
                  backgroundColor:
                    selectedLecture.url === lecture.url
                      ? anotherBlue
                      : "transparent",
                  color:
                    selectedLecture.url === lecture.url
                      ? darkBlack
                      : lighterBlue,
                }}
                onClick={changeURL(lecture.url, lecture.title)}
                key={index}
              >
                <h3>{lecture.title}</h3>
                {lecture.description && (
                  <p
                    style={{
                      fontSize: "0.9em",
                      opacity: 0.8,
                      margin: "5px 0 0 0",
                    }}
                  >
                    {lecture.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <h5>
            One of the most effective ways to learn how to code can come from
            teaching others how to code.
          </h5>
          <ul>
            <li>
              <h3>Increases confidence</h3>
            </li>
            <li>
              <h3>Practice soft skills</h3>
            </li>
            <li>
              <h3>Key to mastery</h3>
            </li>
          </ul>
        </div>

        {/* Second column - Video Player */}
        <div>
          <h2 style={{ textAlign: "center", color: lighterBlue }}>
            {selectedLecture.title}
          </h2>
          {selectedLecture.url && (
            <ReactPlayer
              url={selectedLecture.url}
              width="100%"
              height="400px"
              controls
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Lectures;
