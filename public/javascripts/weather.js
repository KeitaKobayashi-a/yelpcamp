async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&models=jma_seamless&current_weather=true`
    );
    const data = await res.json();
    console.log("APIレスポンス", data);

    const weatherDiv = document.getElementById("weather-info");
    weatherDiv.textContent = `気温: ${data.current_weather.temperature}°C`;
  } catch (error) {
    console.error("fetchエラー:", error);
  }
}
