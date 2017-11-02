import axios from 'axios';
import getUrlById from './getUrlById';

class HouseStorage {

  constructor(key) {
    let data;

    try {
      data = JSON.parse(localStorage[key]);
    } catch(err) {
      data = [];
    }

    this.key = key;
    this.data = data;
  }

  get() {
    return this.data;
  }

  updateData(newData) {
    this.data = newData;
    localStorage[this.key] = JSON.stringify(newData);
  }

  add(url, cb) {
    this.fetchHouseData(url)
      .then(res => {
        if (!res) {
          alert('Oops! No Data!');
          return;
        }

        const currentIds = this.data.map(item => item.id);
        
        if (currentIds.includes(res.id)) {
          alert('已加過了！');
          return;
        }
    
        const newData = [
          ...this.data,
          res
        ];
    
        this.updateData(newData);
        if (typeof cb === 'function') cb(newData);
      })
      .catch(err => console.log(err));

  }

  remove(id, cb) {
    const newData = this.data.filter(item => item.id !== id);

    this.updateData(newData);
    
    if (typeof cb === 'function') cb(newData);
  }

  fetchHouseData(url) {
    return new Promise((resolve, reject) => {
      axios.post('/api', {url})
        .then(res => {
          resolve(res.data);
        })
        .catch(err => reject(err));
    });
  }

  async checkData(cb) {
    const updated = [];
    const availableData = this.data.filter(item => {
      return !(item.status === 'off' || item.dealEnd);
    });

    for (const item of availableData) {
      const newItem = await this.fetchHouseData(getUrlById(item.id));
      if (!newItem) {
        updated.push({...item, status: 'off'})
      } else if (newItem.price !== item.price) {
        updated.push({...newItem, status: 'priceChange'});
      } else if (newItem.dealEnd !== item.dealEnd) {
        updated.push({...newItem, status: 'dealEnd'});
      }
    }

    if (updated.length > 0) {
      const newData= [...this.data];

      updated.forEach(updatedItem => {
        const updatedItemIndex = newData.findIndex(oldItem => oldItem.id === updatedItem.id);
        newData.splice(updatedItemIndex, 1, updatedItem);
      });

      cb({
        newData,
        updated
      });

      this.updateData(newData);
    } else {
      cb(null);
    }
  }

}

export default HouseStorage;