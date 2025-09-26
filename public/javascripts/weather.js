async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&forecast_days=1`
    );
    const data = await res.json();
    console.log("APIレスポンス", data);

    const weatherDiv = document.getElementById("weather-info");
    weatherDiv.textContent = `気温: ${data.current.temperature_2m}°C`;
  } catch (error) {
    console.error("fetchエラー:", error);
  }
}
