function getMoney(userData, bankData) {
  return new Promise((resolve, reject) => {
    const viewBalance = window.confirm('Переглянути баланс картки?');

    const currencies = Object.keys(bankData).join(', ');

    if (viewBalance) { 
      const currency = prompt(`Введіть валюту, щоб переглянути баланс у форматі: ${currencies}`).toUpperCase().replace(/ /g, '');
      const balance = userData[currency];
      if (balance !== undefined) {
        console.log(`Баланс складає: ${balance} ${currency}`);
        resolve();
      } else {
        alert('Введено невірну валюту. Спробуйте ще раз.');
        resolve(getMoney(userData, bankData));
      }
    } else {
      const currency = prompt(`Введіть валюту для виведення коштів:у форматі: ${currencies}`).toUpperCase().replace(/ /g, '').trim();
      const amount = parseFloat(prompt('Введіть суму для виведення:'));

      const currencyData = bankData[currency];

      if (currencyData && amount >= currencyData.min && amount <= currencyData.max) {
        console.log(`Ось ваша готівка. ${amount} ${currency} ${currencyData.img}`);
        resolve();
      } else if (!currencyData) {
        alert('Введено невірну валюту. Спробуйте ще раз.');
        resolve(getMoney(userData, bankData));
      } else if (amount < currencyData.min) {
        alert(`Введена сума менша за дозволений мінімум. Мінімальна сума виведення: ${currencyData.min}`);
        resolve(getMoney(userData, bankData));
      } else if (amount > currencyData.max) {
        alert(`Введена сума перевищує дозволений максимум. Максимальна сума виведення: ${currencyData.max}`);
        resolve(getMoney(userData, bankData));
      }
    }
  }).then(() => {
    console.log('Дякуємо, гарного вам дня 😊');
  }).catch(() => {
    console.log('Дякуємо, гарного вам дня 😊');
  });
}

let userData = {
  'USD': 1000,
  'EUR': 900,
  'UAH': 15000,
  'BIF': 20000,
  'AOA': 100
};

let bankData = {
  'USD': {
    max: 3000,
    min: 100,
    img: '💵'
  },
  'EUR': {
    max: 1000,
    min: 50,
    img: '💶'
  },
  'UAH': {
    max: 0,
    min: 0,
    img: '💴'
  },
  'GBP': {
    max: 10000,
    min: 100,
    img: '💷'
  }
};

getMoney(userData, bankData);