// get references to the DOM elements
const fetchBtn = document.getElementById('fetch-cats-btn');
const temperamentSelect = document.getElementById('temperament-select');
const resultsContainer = document.getElementById('results-container');
const statusDisplay = document.getElementById('status-display');

// add event listener to the fetch button
fetchBtn.addEventListener('pointerdown', async () => {
    const selectedTemperament = temperamentSelect.value;

    // 1. load the selected temperament and disable the button to prevent multiple requests
    fetchBtn.disabled = true;
    fetchBtn.textContent = "Searching cats...";
    statusDisplay.innerText = "Fetching data from FreeAPI...";
    resultsContainer.innerHTML = "";

    try {
        // 2. use fetch API to retrieve data from the FreeAPI endpoint
        const response = await fetch(`https://api.freeapi.app/api/v1/public/cats?query=${selectedTemperament}&page=1&limit=10`);

        // 3. strictly check the HTTP response status code to ensure it's 200 OK
        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }

        const result = await response.json();

        // 4. check the structure of the returned data to ensure it contains the expected fields
        if (result.success && result.data && result.data.data) {
            const catsArray = result.data.data;

            if (catsArray.length === 0) {
                statusDisplay.innerText = "No cats found for this temperament.";
                return;
            }

            statusDisplay.innerText = `Successfully loaded ${catsArray.length} cats!`;

            // 5. createElement and innerHTML
            catsArray.forEach(cat => {
                const card = document.createElement('div');
                card.classList.add('cat-card');

                // interpolate cat data into the card's innerHTML, with fallback for missing images or descriptions
                card.innerHTML = `
                    <img src="${cat.image || '../../week1/img/image-loading-failure.png'}" alt="${cat.name}" class="cat-image">
                    <h3>${cat.name}</h3>
                    <p><strong>Temperament:</strong> ${cat.temperament}</p>
                    <p class="cat-desc">${cat.description ? cat.description.substring(0, 100) + '...' : 'No description available.'}</p>
                `;

                // output the card to the results container
                resultsContainer.appendChild(card);
            });

        } else {
            statusDisplay.innerText = "Data format invalid or empty.";
        }

    } catch (error) {
        // 6. raise errors and log them to the console for debugging purposes
        console.error("Error fetching cats:", error);
        statusDisplay.innerText = "An error occurred while fetching data. Please try again.";
    } finally {
        // 7. unlock the button and reset its text content at the end
        fetchBtn.disabled = false;
        fetchBtn.textContent = "Fetch Cats";
    }
});