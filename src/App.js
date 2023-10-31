import { useEffect, useState } from "react";
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

function App() {
  const [currentValue, setCurrentValue] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [conversionCurrency, setConversionCurrency] = useState("USD");
  const [valueAfterConversion, setValueAfterConversion] = useState("");
  const [isLoadning, setIsLoading] = useState(false);

  function handleInputChange(e) {
    if (
      e.target.value === "" ||
      (!isNaN(e.target.value) && Number(e.target.value) > 0)
    ) {
      setCurrentValue(e.target.value);
    }
  }

  function handleBaseCurrency(e) {
    setBaseCurrency(e.target.value);
  }

  function handleConversionCurrency(e) {
    setConversionCurrency(e.target.value);
  }

  useEffect(
    function () {
      if (baseCurrency !== conversionCurrency && currentValue !== "") {
        setIsLoading(true);
        const controller = new AbortController();

        async function fetchCurrency() {
          try {
            const res = await fetch(
              `https://api.frankfurter.app/latest?amount=${currentValue}&from=${baseCurrency}&to=${conversionCurrency}`,
              { signal: controller.signal }
            );

            if (!res.ok)
              throw new Error("Somthing went wrong with fetching movies");

            const data = await res.json();
            if (data.Response === "False")
              throw new Error("Currency not found");

            console.log(data);
            console.log(Object.values(data.rates).at(0));

            const valAftConv = data.rates[conversionCurrency];

            setValueAfterConversion(valAftConv);
          } catch (err) {
            console.log(err.message);
          } finally {
            setIsLoading(false);
          }
        }

        fetchCurrency();

        return function () {
          controller.abort();
        };
      } else {
        setValueAfterConversion(currentValue);
      }
    },
    [baseCurrency, conversionCurrency, currentValue]
  );

  return (
    <>
      <div>
        <input
          onChange={handleInputChange}
          value={currentValue}
          disabled={isLoadning}
        />
        <select
          onChange={handleBaseCurrency}
          value={baseCurrency}
          disabled={isLoadning}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <select
          onChange={handleConversionCurrency}
          value={conversionCurrency}
          disabled={isLoadning}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
      </div>
      <p>{valueAfterConversion}</p>
    </>
  );
}

export default App;
