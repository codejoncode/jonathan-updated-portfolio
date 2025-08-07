import React from "react";
import { Item, Header, List } from "semantic-ui-react";

interface PlanLinksProps {
  links: string;
  lighterBlue: string;
}

const PlanLinks: React.FC<PlanLinksProps> = ({ links, lighterBlue }) => {
  let urls: string[] = [];
  if (links) {
    urls = links.split(",");
  }

  if (urls.length === 0) {
    return <div />;
  }

  return (
    <Item style={{ marginBottom: "20px" }}>
      <Header style={{ color: lighterBlue }}>Plan</Header>
      <List>
        {urls.map((url, index) => (
          <List.Item key={index}>
            <a
              href={url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: lighterBlue, textDecoration: "underline" }}
            >
              {url.trim()}
            </a>
          </List.Item>
        ))}
      </List>
    </Item>
  );
};

export default PlanLinks;
