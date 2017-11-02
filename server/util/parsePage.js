const cheerio = require('cheerio');

function parsePage(html) {
  const $ = cheerio.load(html);
  let data;

  try {
    const idResult = $('.addr').next().text().match(/\d+/);

    data = {
      title: $('.houseInfoTitle').text(),
      address: $('.addr').text(),
      price: $('.detailInfo .price i').text().trim(),
      cover: $('.viewer img').attr('src'),
      area: $('.detailInfo .attr li').eq(0).text().replace(/\W+\s:\s+/, ''),
      floor: $('.detailInfo .attr li').eq(1).text().replace(/\W+\s:\s+/, ''),
      kindName: $('.detailInfo .attr li').eq(3).text().replace(/\W+\s:\s+/, ''),
      id: Array.isArray(idResult) && idResult[0],
      dealEnd: $('.userInfo .DealEnd').text() || ''
    }

  } catch(err) {
    data = null;
  }

  if (!data.id && !data.title && !data.price) return null;

  return data;
}

module.exports = parsePage;