import React from "react";
import HeaderItem from "./HeaderItem";
import { Grid, Icon, Card, List } from "semantic-ui-react";

interface HeaderCardProps {
  title: string;
  group: string[];
}

const HeaderCard: React.FC<HeaderCardProps> = ({ title, group }) => {
  if (title && group) {
    return (
      <Grid.Column>
        <Card style={{ backgroundColor: "#C5C6C7" }}>
          <div style={{ textAlign: "center" }}>
            <Icon name="desktop" size="huge" style={{ color: "#66FCF1" }} />
          </div>
          <Card.Content>
            <Card.Header>{title}</Card.Header>
            <Card.Description>
              <List>
                {group.map((item, index) => (
                  <HeaderItem itemName={item} key={index} />
                ))}
              </List>
            </Card.Description>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  }
  return <div />;
};

export default HeaderCard;
