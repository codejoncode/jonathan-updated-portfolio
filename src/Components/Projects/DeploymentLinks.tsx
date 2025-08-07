import React from "react";
import { Item, Header, List } from "semantic-ui-react";

interface DeploymentLinksProps {
  links: string;
  lighterBlue: string;
}

const DeploymentLinks: React.FC<DeploymentLinksProps> = ({
  links,
  lighterBlue,
}) => {
  let urls: string[] = [];
  if (links) {
    urls = links.split(",");
  }

  return (
    <Item style={{ marginBottom: "20px" }}>
      <Header style={{ color: lighterBlue }}>Deployment</Header>
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

export default DeploymentLinks;
