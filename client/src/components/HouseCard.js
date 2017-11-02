import React from 'react';
import getUrlById from '../util/getUrlById';

const HouseCard = ({
  id, cover, title, price, kindName, address, floor, area, dealEnd, status, onRemoveItem, updateText
}) => (
  <div className="HouseCard">
    <a href={getUrlById(id)} target="_blank">
      <div className="HouseCard__bd">
        <div className="HouseCard__img">
          <img src={cover && cover.replace('210x158', '400x290')} alt=""/>
        </div>
        <div className="HouseCard__info">
          <h1 className="HouseCard__title">{title}</h1>
          <div className="HouseCard__tags">
            <Tag>{kindName}</Tag>
            <Tag>{area}</Tag>
            <Tag>{floor}</Tag>
          </div>
          <p className="HouseCard__address">{address}</p>
          <div className="HouseCard__footer">
            <p className="HouseCard__price">{price}</p>
            {dealEnd && <p className="HouseCard__status">{dealEnd}</p>}
            {status === 'off' && <p className="HouseCard__status">已下架</p>}
            {updateText && <p className="HouseCard__updated">{updateText}</p>}
          </div>
        </div>
      </div>
    </a>
    <a href="javascript:;" className="HouseCard__remove" onClick={() => onRemoveItem(id)}>✖</a>
  </div>
);

const Tag = ({children}) => (
  <span className="Tag">{children}</span>
);

export default HouseCard;