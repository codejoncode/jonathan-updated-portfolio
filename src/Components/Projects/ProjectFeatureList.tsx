import React from "react";
import { Icon, List } from "semantic-ui-react";

interface ProjectFeatureListProps {
  features: string;
  lighterBlue: string;
}

const ProjectFeatureList: React.FC<ProjectFeatureListProps> = ({
  features,
  lighterBlue,
}) => {
  const featuresList = features ? features.split(",") : [];

  if (featuresList.length === 0) {
    return <div>No features listed</div>;
  }

  return (
    <List>
      {featuresList.map((feature, index) => (
        <List.Item key={index}>
          <Icon name="check" style={{ color: lighterBlue }} />
          <List.Content>
            <List.Header style={{ color: lighterBlue }}>
              {feature.trim()}
            </List.Header>
          </List.Content>
        </List.Item>
      ))}
    </List>
  );
};

export default ProjectFeatureList;
