import React from 'react';

const CardItem = props => {
    const { count, name, title1 } = props;

  return (
    <div className="col-md-4 p-0 text-center">
      <div className="d-section">
        <h2>{count}</h2>
        <p>
          {name ? <b> {name}</b> : ''}
            {title1 && title1.trim() !== '' ? <span>{title1}</span> : ''}
        </p>
      </div>
    </div>
  );
};

export default CardItem;
