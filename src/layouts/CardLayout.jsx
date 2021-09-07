import React, { Fragment } from 'react';
import CardItem from '../components/CardItem';
const DashboardCards = props => {
  let { cards, active } = props;
  return (
    <Fragment>
      {cards && active ? (
        <div className="row">
          {cards.map((card, index) => (
            <CardItem
              count={card.count}
              name={card.name}
              title1={card.title1}
              title2={card.title2}
              key={index}
            />
          ))}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <div className=" text-primary text-center">No data available</div>
        </div>
      )}
    </Fragment>
  );
};

export default DashboardCards;
