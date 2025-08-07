import React from "react";
import { List } from "semantic-ui-react";

interface HeaderItemProps {
  itemName: string;
}

const HeaderItem: React.FC<HeaderItemProps> = ({ itemName }) => {
  return (
    <List.Item>
      <List.Content>
        <List.Header style={{ color: "#0B0C10" }}>{itemName}</List.Header>
      </List.Content>
    </List.Item>
  );
};

export default HeaderItem;
