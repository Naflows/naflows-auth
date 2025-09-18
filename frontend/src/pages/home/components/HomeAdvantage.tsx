import React from "react";

const HomeAdvantage = ({
  title,
  content,
  icon,
  imgLink,
}: {
  title: string;
  content: React.JSX.Element;
  icon: React.JSX.Element;
  imgLink?: string;
}) => {
  return (
    <div className="nass_advantage nass_homepage__box">
      <div className="nass_advantage__body">
        <span className="nass_advantage__title">
          {icon}
          <span>{title}</span>
        </span>
        <span className="nass_advantage__content">{content}</span>
      </div>
      <div className="nass_advantage__image">
        <img src={imgLink} alt={title} />
      </div>
    </div>
  );
};

export default HomeAdvantage;
