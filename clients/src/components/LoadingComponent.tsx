import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface LoadingComponentProps {
  content?: string;
  inverted?: boolean;
  active?: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
  content = "Loading...",
  inverted = true,
  active = true,
}) => {
  if (!active) return null;
  
  return (
    <Dimmer active={active} inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;