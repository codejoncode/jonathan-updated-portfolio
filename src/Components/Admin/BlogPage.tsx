import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Form,
  Button,
  Grid,
  Container,
  Input,
  TextArea,
  Confirm,
} from "semantic-ui-react";
import { lighterBlue, darkBlack } from "../../Helpers/Colors/colors";
import {
  fetchOneBlog,
  editBlog,
  deleteBlog,
  postBlog,
} from "../../Store/Actions/blogActions";
import { RootState } from "../../types";

const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentBlog = useSelector(
    (state: RootState) => state.blogReducer.currentBlog,
  );
  const loading = useSelector((state: RootState) => state.blogReducer.loading);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [open, setOpen] = useState(false);

  const isEditing = !!id && id !== "new";

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchOneBlog(parseInt(id)) as any);
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (currentBlog && isEditing) {
      setFormData({
        title: currentBlog.title,
        message: currentBlog.message,
      });
    }
  }, [currentBlog, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("holloway-portfolio-token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (isEditing && id) {
      await dispatch(editBlog(parseInt(id), token, formData) as any);
    } else {
      await dispatch(postBlog(token, formData) as any);
    }

    navigate("/admin/blogs");
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("holloway-portfolio-token");
    if (token && id) {
      await dispatch(deleteBlog(token, parseInt(id)) as any);
      navigate("/admin/blogs");
    }
  };

  const show = () => setOpen(true);
  const handleCancel = () => setOpen(false);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          color: lighterBlue,
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Container>
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column>
            <Button
              style={{ background: lighterBlue, color: darkBlack }}
              as={Link}
              to="/admin/blogs"
            >
              Go Back to Blogs
            </Button>
            <br />
            <br />
            {isEditing && (
              <>
                <Button
                  style={{ background: "#ff6b6b", color: "white" }}
                  onClick={show}
                >
                  Delete Blog
                </Button>
                <br />
                <br />
              </>
            )}

            <Confirm
              open={open}
              cancelButton="Cancel"
              confirmButton="Delete (cannot be undone)"
              onCancel={handleCancel}
              onConfirm={handleDelete}
              content="Are you sure you want to delete this blog post?"
            />

            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <label style={{ color: lighterBlue }}>Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: darkBlack,
                    color: lighterBlue,
                  }}
                />
              </Form.Field>

              <Form.Field>
                <label style={{ color: lighterBlue }}>Content</label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={10}
                  required
                  style={{
                    backgroundColor: darkBlack,
                    color: lighterBlue,
                  }}
                />
              </Form.Field>

              <Button
                type="submit"
                style={{ background: lighterBlue, color: darkBlack }}
              >
                {isEditing ? "Update Blog" : "Create Blog"}
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default BlogPage;
