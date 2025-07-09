const form = document.querySelector("form");
const input = document.querySelector("input");
const msg = document.querySelector(".msg");
const list = document.querySelector(".cities");
const apiKey = "10fa034bd57444bc1df47782334e2cf2";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputVal = input.value.trim();

  const existingCities = Array.from(document.querySelectorAll(".city"));
  const duplicate = existingCities.some((el) => {
    const cityName = el.querySelector(".city-name span").textContent.toLowerCase();
    const countryCode = el.querySelector(".city-name sup").textContent.toLowerCase();
    return (
      inputVal.toLowerCase() === cityName ||
      inputVal.toLowerCase() === `${cityName},${countryCode}`
    );
  });

  if (duplicate) {
    msg.textContent = `You already know the weather for ${inputVal}. Try another city. 😉`;
    form.reset();
    input.focus();
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { name, sys, main, weather } = data;
      const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

      const li = document.createElement("li");
      li.className =
        "city bg-white text-gray-800 rounded-xl p-6 shadow-md flex flex-col items-center";

      li.innerHTML = `
        <h2 class="city-name text-xl font-bold text-center" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup class="ml-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm">${sys.country}</sup>
        </h2>
        <div class="city-temp text-3xl font-semibold mt-2">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure class="flex flex-col items-center mt-3">
          <img class="w-20 h-20" src="${iconUrl}" alt="${weather[0].description}">
          <figcaption class="text-sm text-gray-600 mt-1 uppercase tracking-wide">${weather[0].description}</figcaption>
        </figure>
      `;

      list.appendChild(li);
      msg.textContent = "";
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city 😩";
    });

  form.reset();
  input.focus();
});
