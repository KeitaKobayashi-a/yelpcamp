async function getWeather(lat, lon) {
  try {
    console.log("APIレスポンス", data);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&models=jma_seamless&current_weather=true`
    );
    const data = await res.json();

    const weatherDiv = document.createElement("div");
    weatherDiv.innerHTML = `<p>気温: ${data.current_weather.temperature}°C</p>`;
    document.body.appendChild(weatherDiv);
  } catch (error) {
    console.error("fetchエラー:", err);
  }
}
