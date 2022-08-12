console.log('Client side JS file is loaded');

const weatherForm = document.querySelector('form');
const searchInput = document.querySelector('input');

const weatherText = document.querySelector('#weatherText');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = searchInput.value;

    statusText.textContent = 'Loading ...';

    fetch(`http://localhost:3000/weather?address=${location}`).then(
        (response) => {
            response.json().then((data) => {
                if (data.error) {
                    weatherText.textContent = data.error;
                    return;
                }

                weatherText.textContent = `It's ${data.forecast} in ${data.location}`;
            });
        }
    );
});
