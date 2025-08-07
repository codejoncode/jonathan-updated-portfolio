import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../Store/Actions/blogActions";
import {
  Button,
  Grid,
  Container,
  Header,
  List,
  Divider,
} from "semantic-ui-react";
import {
  lighterBlue,
  darkBlack,
  anotherBlue,
} from "../../Helpers/Colors/colors";
import { RootState } from "../../types";

const DisplayBlogs: React.FC = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state: RootState) => state.blogReducer.blogs);
  const loading = useSelector((state: RootState) => state.blogReducer.loading);

  useEffect(() => {
    dispatch(fetchBlogs() as any);
  }, [dispatch]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          color: lighterBlue,
        }}
      >
        Loading blogs...
      </div>
    );
  }

  return (
    <Container>
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Header as="h1" style={{ color: lighterBlue }} textAlign="center">
              Blog Management
            </Header>
            <Button
              as={Link}
              to="/create"
              style={{ background: lighterBlue, color: darkBlack }}
            >
              Add New Blog
            </Button>
            <Divider style={{ backgroundColor: anotherBlue }} />
            <List>
              {blogs &&
                blogs.map((blog) => (
                  <List.Item
                    as={Link}
                    to={`/admin/blog/${blog.id}`}
                    key={blog.id}
                    style={{
                      color: lighterBlue,
                      cursor: "pointer",
                      padding: "10px",
                      borderBottom: `1px solid ${anotherBlue}`,
                      display: "block",
                      textDecoration: "none",
                    }}
                  >
                    <List.Icon name="write square" />
                    <List.Content>
                      <List.Header style={{ color: lighterBlue }}>
                        {blog.title}
                      </List.Header>
                      <List.Description style={{ color: anotherBlue }}>
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default DisplayBlogs;
