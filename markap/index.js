const parse = (response) => JSON.parse(response);

function checkBalance(userData, bankData) {
  const isCheckBalance = confirm('Бажаєте переглянути баланс?');

  if (isCheckBalance) {
    getAvailableCurrencies()
      .then((data) => {
        const currencies = Object.keys(data.userData);
        const selectedCurrency = prompt(`Введіть валюту для перегляду балансу (доступні валюти: ${currencies.join(', ')})`).toUpperCase().trim().replace(/ /g, '');

        if (!data.userData.hasOwnProperty(selectedCurrency)) {
          console.log('Не вірно вказана валюта, спробуйте ще раз.');
          checkBalance(userData);
        } else {
          console.log(`Ваш баланс складає ${userData[selectedCurrency]} ${selectedCurrency}`);
          showThankYouMessage();
        }
      })
      .catch((err) => {
        handleWithdrawError(err, userData, bankData);
      });
  } else {
    getCurrencyForWithdrawal(userData, bankData);
  }
}

function showThankYouMessage() {
  console.log('Дякуємо, гарного дня 😊');
}

function handleWithdrawError(err, userData, bankData) {
  if (err.userData && err.bankData) {
    const userData = err.userData;
    const bankData = err.bankData;

    const currenciesWithNoBills = Object.keys(userData).filter(currency => bankData[currency].max === 0);

    if (currenciesWithNoBills.length > 0) {
      const selectedCurrency = prompt(`Банкомат не має купюр у валютах: ${currenciesWithNoBills.join(', ')}. Введіть валюту для зняття готівки або натисніть "Скасувати" для продовження.`);

      if (selectedCurrency === null) {
        getCurrencyForWithdrawal(userData, bankData);
      } else {
        withdrawMoney(userData, bankData, selectedCurrency);
      }
    } else {
      console.log('Помилка: Немає доступних валют для зняття готівки.');
    }
  } else {
    console.log('Операція скасована.');
    showThankYouMessage();
  }
}

function getCurrencyForWithdrawal(userData, bankData) {
  const currencies = Object.keys(bankData);
  const currencyInput = prompt(`Введіть валюту для зняття готівки (${currencies.join(', ')})`);

  if (currencyInput === null) {
    console.log('Операція скасована.');
    showThankYouMessage();
    return;
  }

  const formattedCurrencyInput = currencyInput.toUpperCase().trim().replace(/ /g, '');

  if (!bankData.hasOwnProperty(formattedCurrencyInput) || !bankData.hasOwnProperty(formattedCurrencyInput)) {
    console.log('Невірно вказана валюта, спробуйте ще раз');
    getCurrencyForWithdrawal(userData, bankData);
  } else {
    withdrawMoney(userData, bankData, formattedCurrencyInput);
  }
}

function withdrawMoney(userData, bankData, currency) {
  const amount = parseInt(prompt(`Введіть суму для зняття готівки у валюті ${currency} (максимальна сума: ${bankData[currency].max}, мінімальна сума: ${bankData[currency].min})`));

  if (isNaN(amount)) {
    console.log('Введена некоректна сума. Будь ласка, спробуйте ще раз.');
    withdrawMoney(userData, bankData, currency);
    return;
  }

  if (amount < bankData[currency].min) {
    console.log(`Введена сума менша за дозволений мінімум. Мінімальна сума виведення: ${bankData[currency].min}`);
    showThankYouMessage();
    return;
  }

  if (amount > bankData[currency].max) {
    console.log(`Введена сума перевищує дозволений максимум. Максимальна сума зняття: ${bankData[currency].max}`);
    showThankYouMessage();
    return;
  }

  if (amount > userData[currency]) {
    console.log('Недостатньо коштів на балансі.');
    showThankYouMessage();
    return;
  }

  userData[currency] -= amount;
  console.log(`Ось ваші готівкові ${amount} ${currency} ${bankData[currency].img}`);
  showThankYouMessage();
}

function getMoney(userData, bankData) {
  const isCheckBalance = confirm('Бажаєте переглянути баланс?');

  return new Promise((resolve, reject) => {
    isCheckBalance ? resolve(userData) : reject({ userData, bankData });
  });
}

function getAvailableCurrencies() {
  return new Promise((resolve, reject) => {
    const controller = new XMLHttpRequest();
    controller.open('GET', 'atm.json');
    controller.send();
  
    controller.addEventListener('readystatechange', () => {
      if (controller.readyState === 4) {
        controller.status < 400 ? resolve(parse(controller.response)) : reject(controller.status);
      }
    });
  });
}

getAvailableCurrencies()
  .then((data) => {
    const userData = data.userData;
    const bankData = data.bankData;

    checkBalance(userData, bankData);
  })
  .catch((err) => console.log(err));