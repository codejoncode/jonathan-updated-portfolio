import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  List,
  Header,
  Icon,
  Grid,
  Button,
  Image,
} from "semantic-ui-react";
import {
  darkBlack,
  lighterBlue,
  anotherBlue,
} from "../../Helpers/Colors/colors";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const changePages = (path: string) => () => {
    navigate(path);
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: darkBlack,
        padding: "40px 0",
        borderTop: `2px solid ${anotherBlue}`,
        marginTop: "50px",
      }}
    >
      <Grid centered>
        <Grid.Column width={12}>
          {/* Footer Image */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Image
              src="/footer-picture.png"
              size="medium"
              centered
              style={{
                borderRadius: "8px",
                boxShadow: `0 4px 8px rgba(69, 162, 158, 0.3)`,
              }}
            />
          </div>

          <Header
            as="h2"
            textAlign="center"
            style={{ color: lighterBlue, marginBottom: "30px" }}
          >
            Connect With Me
          </Header>

          <Grid columns={3} stackable textAlign="center">
            <Grid.Column>
              <List>
                <List.Item>
                  <a
                    style={{ color: lighterBlue, fontSize: "1.2em" }}
                    href="https://github.com/codejoncode"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="github" size="big" /> GitHub
                  </a>
                </List.Item>
              </List>
            </Grid.Column>

            <Grid.Column>
              <List>
                <List.Item>
                  <a
                    style={{ color: lighterBlue, fontSize: "1.2em" }}
                    href="https://www.linkedin.com/in/jonathanjholloway/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="linkedin" size="big" /> LinkedIn
                  </a>
                </List.Item>
              </List>
            </Grid.Column>

            <Grid.Column>
              <Button
                style={{
                  backgroundColor: darkBlack,
                  color: anotherBlue,
                  border: `1px solid ${anotherBlue}`,
                }}
                onClick={changePages("/contact")}
              >
                <Icon name="mail" />
                Contact Me
              </Button>
            </Grid.Column>
          </Grid>

          <Header
            as="h4"
            textAlign="center"
            style={{
              color: anotherBlue,
              marginTop: "30px",
              borderTop: `1px solid ${anotherBlue}`,
              paddingTop: "20px",
            }}
          >
            © 2024 Jonathan J. Holloway. All rights reserved.
          </Header>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Footer;
