const API_HOST = " https://v6.exchangerate-api.com/v6";
const API_KEY = "6915e6b49239f851591ecb89";

const currencies = ["USD", "EUR", "CAD", "CNY", "CHF", "SGD"];
const updateInterval = 15 * 60 * 1000;

function getLastUpdatedTime() {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}

async function fetchExchangeRates(baseCurrency) {
  const url = `${API_HOST}/${API_KEY}/latest/${baseCurrency}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.result === "success") {
      return data.conversion_rates;
    } else {
      console.error("Ошибка получения курсов:", data["error-type"]);
    }
  } catch (error) {
    console.error("Ошибка сети или запроса:", error);
  }
}

async function updateCurrencyRates() {
  const container = document.getElementById("currencyContainer");
  container.innerHTML = "";

  const rate = await fetchExchangeRates("RUB");
  console.log(rate);
  for (const currency of currencies) {
    if (rate) {
      container.innerHTML += `
        <div class="currency-item">
          <span class="currency-name">${currency}:</span>
          <span class="currency-rate">${(1 / rate[currency]).toFixed(2)}</span>
        </div>
      `;
    } else {
      container.innerHTML += `
        <div class="currency-item">
          <span class="currency-name">${currency}:</span>
          <span class="currency-rate">N/A</span>
        </div>
      `;
    }
  }

  document.querySelector(
    ".update-info"
  ).textContent = `Update every 15 minutes, ${getLastUpdatedTime()}`;
}

updateCurrencyRates();
setInterval(updateCurrencyRates, updateInterval);
