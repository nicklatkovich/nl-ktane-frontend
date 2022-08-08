import React from "react";

export const ExternalLink: React.FC<{ href: string }> = (props) => {
  return (
    <a href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</a>
  )
};
