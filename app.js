// Fetch currencies and populate dropdowns
async function fetchCurrencies() {
    const response = await fetch('https://api.frankfurter.app/currencies');
    const data = await response.json();
    const baseCurrency = document.getElementById('baseCurrency');
    const targetCurrency = document.getElementById('targetCurrency');
  
    for (const [code, name] of Object.entries(data)) {
      const option1 = document.createElement('option');
      option1.value = code;
      option1.text = `${code} - ${name}`;
      baseCurrency.appendChild(option1);
  
      const option2 = document.createElement('option');
      option2.value = code;
      option2.text = `${code} - ${name}`;
      targetCurrency.appendChild(option2);
    }
  }
  
  // Currency Conversion
  document.getElementById('convertBtn').addEventListener('click', async () => {
    const amount = document.getElementById('amount').value;
    const base = document.getElementById('baseCurrency').value;
    const target = document.getElementById('targetCurrency').value;
  
    if (!amount || !base || !target) {
      alert('Please fill all fields');
      return;
    }
  
    const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${target}`);
    const data = await response.json();
    const result = `${amount} ${base} = ${data.rates[target]} ${target}`;
    document.getElementById('conversionResult').innerText = result;
  });
  
  // Historical Exchange Rates
  document.getElementById('fetchHistoryBtn').addEventListener('click', async () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const base = document.getElementById('baseCurrency').value;
    const target = document.getElementById('targetCurrency').value;
  
    if (!startDate || !endDate || !base || !target) {
      alert('Please fill all fields');
      return;
    }
  
    const response = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${target}`);
    const data = await response.json();
    const rates = data.rates;
  
    let table = `<table class="table"><thead><tr><th>Date</th><th>Rate</th></tr></thead><tbody>`;
    for (const [date, rate] of Object.entries(rates)) {
      table += `<tr><td>${date}</td><td>${rate[target]}</td></tr>`;
    }
    table += `</tbody></table>`;
    document.getElementById('historyTable').innerHTML = table;
  
    // Bar Chart Visualization
    const chartLabels = Object.keys(rates);
    const chartData = Object.values(rates).map(rate => rate[target]);
    renderChart(chartLabels, chartData);
  });
  
  // Render Chart
  function renderChart(labels, data) {
    const ctx = document.getElementById('exchangeRateChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Exchange Rate',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Dark Mode Toggle
  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });
  
  // Initialize
  fetchCurrencies();