import React, { Component } from 'react';
import HouseCard from './components/HouseCard';
import HouseStorage from './util/HouseStorage';
import './App.css';

const houseStorage = new HouseStorage('house');

class App extends Component {

  constructor() {
    super();
    this.state = {
      data: [],
      updated: [],
      inputValue: ''
    };
  }

  componentDidMount() {
    const data = houseStorage.get();

    if (data.length > 0) {
      this.setState({data});
      houseStorage.checkData(result => {
        if (!result) return;

        this.setState({
          data: result.newData,
          updated: result.updated
        });
      })
    }
  }

  onInputChange = (event) => {
    this.setState({inputValue: event.target.value});
  }

  onInputEnter = (event) => {
    const { inputValue } = this.state;

    if (!inputValue || event.keyCode !== 13) return;

    houseStorage.add(inputValue, data => {
      this.setState({
        data,
        inputValue: ''
      });
    });
  }

  onRemoveItem = (id) => {
    houseStorage.remove(id, data => {
      this.setState({data});
    });
  }

  render() {
    const { data, updated, inputValue } = this.state;
    const priceUpdatedItems = updated
      .filter(item => item.status === 'priceChange')
      .map(item => item.id);

    return (
      <div className="App">
        <div className="content">
          <div className="App__input">
            <input
              value={inputValue}
              onChange={this.onInputChange}
              onKeyDown= {this.onInputEnter}
              placeholder="請輸入租屋頁面的網址"
            />
            <p>EX: https://rent.591.com.tw/rent-detail-5748183.html</p>
          </div>
          <div className="items">
            {Array.isArray(data) && data.map(item => 
              <HouseCard
                {...item}
                key={item.id}
                updateText={priceUpdatedItems.includes(item.id) && '價格更動！'}
                onRemoveItem={this.onRemoveItem}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
