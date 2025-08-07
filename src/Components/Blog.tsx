import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Segment,
  Header,
  Image,
  Divider,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { lighterBlue, anotherBlue } from "../Helpers/Colors/colors";
import { fetchBlogs } from "../Store/Actions/blogActions";
import { RootState } from "../types";

const Blog: React.FC = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blogReducer.blogs);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      await dispatch(fetchBlogs() as any);
      setInitialized(true);
    };
    loadBlogs();
  }, [dispatch]);

  if (!initialized) {
    return (
      <div>
        <Segment>
          <Dimmer active>
            <Loader indeterminate>Loading Blogs</Loader>
          </Dimmer>
        </Segment>
      </div>
    );
  }

  return (
    <Container fluid style={{ padding: "20px" }}>
      {blogs && blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} style={{ marginBottom: "50px" }}>
            <Header textAlign="center">
              <Header.Content style={{ color: lighterBlue }}>
                {blog.title}
              </Header.Content>
            </Header>
            <Segment
              inverted
              style={{
                border: `1px solid ${anotherBlue}`,
                backgroundColor: "#1F2833",
              }}
            >
              {blog.image && (
                <>
                  <Image src={blog.image} centered size="medium" />
                  <br />
                </>
              )}
              {blog.message.split("...").map((paragraph, index) => (
                <p
                  style={{
                    color: lighterBlue,
                    fontSize: "1.2em",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                  }}
                  key={index}
                >
                  {paragraph.trim()}
                </p>
              ))}
              <Divider />
              <p
                style={{
                  color: anotherBlue,
                  fontSize: "0.9em",
                  textAlign: "right",
                }}
              >
                Published: {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </Segment>
          </div>
        ))
      ) : (
        <Header
          as="h2"
          textAlign="center"
          style={{ color: lighterBlue, padding: "100px" }}
        >
          No blog posts available yet.
        </Header>
      )}
    </Container>
  );
};

export default Blog;
