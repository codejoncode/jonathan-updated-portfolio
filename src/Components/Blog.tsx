import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Segment,
  Header,
  Image,
  Divider,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { lighterBlue, anotherBlue, darkBlack } from "../Helpers/Colors/colors";
import { fetchBlogs } from "../Store/Actions/blogActions";
import { RootState } from "../types";

const STATIC_POSTS = [
  {
    slug: "/blog/layoff-to-leverage",
    title: "From Layoff to Leverage: Turning Job Loss into Career Acceleration",
    excerpt: "A practical 8-week roadmap for engineers with 3–7 years of experience navigating a 2026 layoff — from financial stabilization to landing AI-augmented roles at $120K+.",
    tags: ["Career", "AI Engineering", "Job Search"],
    date: "April 2026",
    readTime: "8 min read",
  },
];

const Blog: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div style={{ minHeight: "100vh", backgroundColor: darkBlack, padding: "48px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <h1 style={{ color: lighterBlue, fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }}>
          Blog
        </h1>
        <p style={{ color: "#8892b0", marginBottom: "48px" }}>
          Technical writing, career insights, and engineering lessons from the field.
        </p>

        {/* Static posts always shown */}
        {STATIC_POSTS.map((post) => (
          <div
            key={post.slug}
            onClick={() => navigate(post.slug)}
            style={{
              backgroundColor: "rgba(26,26,46,0.9)",
              border: `1px solid rgba(0,210,255,0.2)`,
              borderRadius: "12px",
              padding: "28px",
              marginBottom: "24px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,210,255,0.2)")}
          >
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  backgroundColor: "rgba(0,210,255,0.1)", color: "#00D2FF",
                  border: "1px solid rgba(0,210,255,0.3)", borderRadius: "20px",
                  padding: "2px 10px", fontSize: "0.75rem", fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 style={{ color: "#ccd6f6", fontSize: "1.35rem", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.3 }}>
              {post.title}
            </h2>
            <p style={{ color: "#8892b0", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 16px" }}>
              {post.excerpt}
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ color: "#4a5568", fontSize: "0.82rem" }}>{post.date}</span>
              <span style={{ color: "#4a5568", fontSize: "0.82rem" }}>·</span>
              <span style={{ color: "#4a5568", fontSize: "0.82rem" }}>{post.readTime}</span>
              <span style={{ color: "#00D2FF", fontSize: "0.85rem", marginLeft: "auto", fontWeight: 600 }}>
                Read →
              </span>
            </div>
          </div>
        ))}

        {/* Backend posts */}
        {blogs && blogs.length > 0 && blogs.map((blog) => (
          <div key={blog.id} style={{ marginBottom: "24px" }}>
            <Header textAlign="center">
              <Header.Content style={{ color: lighterBlue }}>{blog.title}</Header.Content>
            </Header>
            <Segment inverted style={{ border: `1px solid ${anotherBlue}`, backgroundColor: "#1F2833" }}>
              {blog.image && <><Image src={blog.image} centered size="medium" /><br /></>}
              {blog.message.split("...").map((paragraph, index) => (
                <p style={{ color: lighterBlue, fontSize: "1.2em", lineHeight: "1.6", marginBottom: "20px" }} key={index}>
                  {paragraph.trim()}
                </p>
              ))}
              <Divider />
              <p style={{ color: anotherBlue, fontSize: "0.9em", textAlign: "right" }}>
                Published: {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </Segment>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Blog;
