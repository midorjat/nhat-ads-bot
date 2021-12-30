class DatePicker extends Date{
  constructor(){
    super();
    this.startDate = new Date();
  }

  setStartDate(date){
    this.startDate = date;
  }

  getStartDate() {
    if(typeof this.startDate != undefined){
      return this.startDate.getDate()+'/'+this.startDate.getMonth()+'/'+this.startDate.getFullYear();
    }
    else{
      console.log("Start Date is not set");
    }
  }

  setEndDate(durationInDates){
     this.endDate = new Date(this.getFullYear(), this.getMonth(), this.getDate()+durationInDates);
  }
  getEndDate() {
    if(typeof this.endDate != undefined){
      return this.endDate.getDate()+'/'+this.endDate.getMonth()+'/'+this.endDate.getFullYear();
    }
    else{
      console.log("End Date is not set");
    }
  }
}

// Specific for batdongsan.com.vn
class AdForm{
  constructor(titleStr, addType, startDate, endDate, content){
    this.titleStrId = 'txtProductTitle';
    this.titleStr = titleStr;
    this.addTypeId = 'ddlVipType';
    this.addType = addType;
    this.startDateId = 'txtStartDate';
    this.startDate = startDate;
    this.startDateId = 'txtEndDate';
    this.endDate = endDate;
    this.contentId = 'txtDescription';
    this.content = content;
  }
}

const infoMap = new Map([
  ['#txtProductTitle', 'Bán nhà mặt phố. Gia đình mình kẹt cần sang mặt tiền đường 297, P.Phước Long B, Quận 9 giá sốc'],
  ['#hddVipType', 1],
  ['#txtEndDate', "2021-12-13"],
  ['#txtDescription', "Bán nhà mặt phố. Gia đình mình kẹt cần sang mặt tiền đường 297, P.Phước Long B, Quận 9 giá sốc. Do tôi kinh doanh nhiều lĩnh vực không có thời gian quản lý nên cần bán lại cho khách thiện chí mua kinh doanh hoặc đầu tư.\n* Dễ dàng di chuyển sang quận 2, quận 7, TP Thủ Đức.\n* Hiện trạng: nhà cấp 4, dễ dàng xây mới, 2 phòng ngủ\n* Cách Mega Market 1km, Tops Market 5km."],
  ['#hddProductType', 38],
  ['#hddProductCate', 163],
  ['#hddCity', 'SG'],
  ['#hddDistrict', 61],
  ['#txtAddress', 'đường 297, P.Phước Long B, Quận 9'],
  ['#txtArea', '280'],
  ['#txtPrice', '197.5'],
  ['#hddPriceType', 5],
  ['#txtBrName', 'Trần Minh Nhật'],
  ['#txtBrAddress', '537 Nguyễn Duy Trinh, Bình Trưng Tây, Quận 2, Hồ Chí Minh, Việt Nam'],
  ['#txtBrPhone', '0987817951'],
  ['#txtBrMobile', '0987817951'], 
  ['#txtBrEmail', 'minnhat68@gmail.com']
  // ['#txtSecureCode', 7777]
]);

const randomUseragent = require('random-useragent');
// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const fs = require('fs');
const https = require('https');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
  }

  const request = require('request');

  //  This is main download function which takes the url of your image
  function download(uri, filename) {
    return new Promise((resolve, reject) => {
      request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
      });
    });
  }
  

/* ============================================================
  Promise-Based Download Function
============================================================ */

// const download = (url, destination) => new Promise((resolve, reject) => {
//   const file = fs.createWriteStream(destination);

//   https.get(url, response => {
//     response.pipe(file);

//     file.on('finish', () => {
//       console.log('Download finish');
//       file.close(resolve(true));
//     });
//   }).on('error', error => {
//     fs.unlink(destination);
//     console.log('download fail');
//     reject(error.message);
//   });
// });
// function mapToJson(map) {
//   return JSON.stringify([...map], null, 2);
// }
// function jsonToMap(jsonStr) {
//   return new Map(JSON.parse(jsonStr));
// }

// const myJson = fs.readFileSync('myData.json');
// const infoMap = jsonToMap(myJson);
console.log("My Map");
console.log(infoMap);

// puppeteer usage as normal
puppeteer.launch({ headless: false }).then(async browser => {
    console.log('Running tests..')
    //Randomize User agent or Set a valid one
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    const page = await browser.newPage()
    // Important to get the correct captcha
    page.setViewport({width: 1000, height: 600, deviceScaleFactor: 1});
    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    /**
     * Takes a screenshot of a DOM element on the page, with optional padding.
     *
     * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
     * @return {!Promise<!Buffer>}
     */
 async function screenshotDOMElement(opts = {}) {
  const padding = 'padding' in opts ? opts.padding : 0;
  const path = 'path' in opts ? opts.path : null;
  const selector = opts.selector;

  if (!selector)
      throw Error('Please provide a selector.');

  const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
          return null;
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
  }, selector);

  if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

  return await page.screenshot({
      path,
      clip: {
          // x: rect.left - padding,
          // y: rect.top - padding,
          x: rect.left + padding,
          y: rect.top,
          width: rect.width + padding * 1,
          height: rect.height + padding * 1
      }
  });
}

    await page.goto('https://m.batdongsan.com.vn/dang-tin-rao-vat-ban-nha-dat');
    //   await page.waitForTimeout(5000)
    // Dien user name
    // await page.waitForSelector('input[id=UserName]');
    // await page.$eval('input[id=UserName]', el => el.value = 'minnhat68');
    // console.log("Fill Username OK");
    // // Dien password
    // await page.waitForSelector('input[id=Password]');
    // await page.$eval('input[id=Password]', el => el.value = 'Dangtin01');
    // console.log("Fill Password OK")
    // // Dang nhap
    // await page.waitForSelector('#ContentPlaceHolder_login_LoginUser_LoginButton');
    // await page.$eval('#ContentPlaceHolder_login_LoginUser_LoginButton', el => el.click());
    // await page.waitForSelector('#form1 > div.body > div.slide-pane > div.slide-body > div.all-margin.us-content > div > div:nth-child(8) > a');
    // await page.$eval('#form1 > div.body > div.slide-pane > div.slide-body > div.all-margin.us-content > div > div:nth-child(8) > a', el => el.click());
    // await page.keyboard.press('Enter');
    // console.log("Log In")
    // await page.waitForTimeout(2000).then(() => console.log('Waited a second!'));
    // try
    // {
    //   await page.evaluate(() => {
    //     var links = [...document.querySelectorAll('a[href="/dang-tin-rao-vat-ban-nha-dat"]')];
    //     console.log("Find %d links", links.length);
    //     if(links.length > 0)
    //     {
    //       links[0].click();
    //     }
    //   });
      // await page.waitForSelector('#bannertop > div > div > div > a > div > img');
      // await page.waitForSelector('#txtProductTitle');
      // await page.$eval('#txtProductTitle', el => el.value = 'GAU GAU');
      // await page.waitForSelector('#hddVipType');
      // await page.$eval('#hddVipType', el => el.value = 3);
      // await page.waitForSelector('#txtEndDate');
      // await page.$eval('#txtEndDate', el => el.value = "2021-12-20");
      // await page.waitForSelector('#txtDescription');
      // await page.$eval('#txtDescription', el => el.value = "Nôi Dung plah plah");
      // // TODO: Need a map (38 Nha dat ban, 49 Nha dat cho thue)
      // // Hinh thuc
      // await page.waitForSelector('#hddProductType');
      // await page.$eval('#hddProductType', el => el.value = 38);
      // // await page.waitForTimeout(500).then(() => console.log('Waited a second!'));
      // // Phan muc (326, 52, 51, 57, 50, 55, 53, 59)
      // await page.waitForSelector('#hddProductCate');
      // await page.$eval('#hddProductCate', el => el.value = 163);
      // // Thanh Pho
      // await page.waitForSelector('#hddCity');
      // await page.$eval('#hddCity', el => el.value = 'SG');
      // // Quan/Huyen
      // await page.waitForSelector('#hddDistrict');
      // await page.$eval('#hddDistrict', el => el.value = 61); // Quan 9
      // // Dia chi
      // await page.waitForSelector('#txtAddress');
      // await page.$eval('#txtAddress', el => el.value = "Địa chỉ plah plah"); 
      // // Dien tich
      // await page.waitForSelector('#txtArea');
      // await page.$eval('#txtArea', el => el.value = "1000");
      // // Gia 
      // await page.waitForSelector('#txtPrice');
      // await page.$eval('#txtPrice', el => el.value = "1000");
      // // Don vi
      // await page.waitForSelector('#hddPriceType');
      // await page.$eval('#hddPriceType', el => el.value = 1); // Quan 9
      // // Thong tin
      // await page.waitForSelector('#txtBrName');
      // await page.$eval('#txtBrName', el => el.value = 'xxxx');

      // console.log(infoMap.get('#txtBrAddress'));
      // await page.waitForSelector('#txtBrAddress');
      // await page.$eval('#txtBrAddress', (el, info) => {el.value = info}, 'yyyy');

      // await page.waitForSelector('#hddProductType');
      // await page.$eval('#hddProductType', el => el.selectedOptions = 1);

      await infoMap.forEach(function(v, k) {
        console.log(k + '-' +v);
        page.waitForSelector(k);
        page.$eval(k, (el, info) => {el.value = info}, v);
      });

      // Wait for CaptchaImagCode
      await page.waitForSelector('#CaptchaImgCode'); 
      // ScreenShot it 
      await screenshotDOMElement({
        path: 'element.png',
        selector: '#CaptchaImgCode',
        padding: 5
      });

      // Call tesseract for Captcha recognition 
      const tesseract = 'tesseract element.png stdout -l eng --psm 7'
      const { execSync } = require('child_process');
      const captcha = execSync(tesseract);
      console.log("Ma xac nhan: "+ captcha.toString().replace(/[^0-9a-z]/gi, ''));
      await page.waitForSelector('#txtSecureCode');
      await page.$eval('#txtSecureCode', (el, info) => {el.value = info}, captcha.toString().replace(/[^0-9a-z]/gi, ''));
      
      // Dang tin
      await page.waitForSelector('#btnSave');
      await page.$eval('#btnSave', el => el.click());

    // }
    // catch(err)
    // {
    //   console.log("Shit: "+ err.message);
    //   page.close();
    // }
    console.log("DONE")
})