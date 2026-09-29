document.addEventListener('DOMContentLoaded', () => {

    const fetchBtn = document.getElementById('fetch-cats-btn');
    const resetBtn = document.getElementById('reset-btn');
    const temperamentSelect = document.getElementById('temperament-select');
    const resultsContainer = document.getElementById('results-container');
    const statusDisplay = document.getElementById('status-display');
    const cloudyCard = document.getElementById('cloudy-card');
    
    const waitHalfSecond = () => new Promise(resolve => setTimeout(resolve, 500));
    
    fetchBtn.addEventListener('pointerdown', async () => {
        const selectedTemperament = temperamentSelect.value;
    
        fetchBtn.disabled = true;
        resetBtn.disabled = true;
        fetchBtn.textContent = "Searching cats...";
        statusDisplay.innerText = "Fetching data from FreeAPI...";
    
        if (cloudyCard && cloudyCard.parentNode) {
            cloudyCard.classList.add('fade-out');
            await waitHalfSecond();
            cloudyCard.remove();
        }
    
        const existingApiCards = resultsContainer.querySelectorAll('.api-card');
        if (existingApiCards.length > 0) {
            existingApiCards.forEach(card => card.classList.add('fade-out'));
            await waitHalfSecond();
            existingApiCards.forEach(card => card.remove());
        }
    
        try {
            const response = await fetch(`https://api.freeapi.app/api/v1/public/cats?query=${selectedTemperament}&page=1&limit=10`);
    
            if (!response.ok) {
                throw new Error(`Server returned status: ${response.status}`);
            }
    
            const result = await response.json();
    
    
            const catsArray = result.data.data;
    
            if (selectedTemperament === "bossy") {
                statusDisplay.innerText = "Cloudy is Bossy....";
                restoreCloudyCard();
                return;
            }
    
            statusDisplay.innerText = `Successfully loaded ${catsArray.length} cats!`;
    
            catsArray.forEach((cat, index) => {
                const card = document.createElement('div');
                card.classList.add('cat-card', 'api-card', 'fade-out');
    
                card.style.transitionDelay = `${index * 0.08}s`;
    
    
                card.innerHTML = `
                    <img src="${cat.image || '../../week1/img/image-loading-failure.png'}" alt="${cat.name}" class="cat-image">
                    <h3>${cat.name}</h3>
                    <p><strong>Temperament:</strong> ${cat.temperament}</p>
                    <p class="cat-desc">${cat.description ? cat.description.substring(0, 100) + '...' : 'No description available.'}</p>
                `;
    
                resultsContainer.appendChild(card);
    
                setTimeout(() => {
                    card.classList.remove('fade-out');
                }, 20);
            });
    
    
    
        } catch (error) {
            console.error("Error fetching cats:", error);
            statusDisplay.innerText = "An error occurred while fetching data. Please try again.";
            restoreCloudyCard();
        } finally {
            fetchBtn.disabled = false;
            resetBtn.disabled = false;
            fetchBtn.textContent = "Fetch Cats";
        }
    });
    
    resetBtn.addEventListener('pointerdown', async () => {
        fetchBtn.disabled = true;
        resetBtn.disabled = true;
        statusDisplay.innerText = "Resetting...";
    
        const existingApiCards = resultsContainer.querySelectorAll('.api-card');
        existingApiCards.forEach(card => {
            card.classList.add('fade-out');
        });
    
        if (existingApiCards.length > 0) {
            await waitHalfSecond();
            existingApiCards.forEach(card => card.remove());
        }
    
        restoreCloudyCard();
    
        statusDisplay.innerText = "Idle";
        fetchBtn.disabled = false;
        resetBtn.disabled = false;
    });
    
    function restoreCloudyCard() {
        if (!document.getElementById('cloudy-card')) {
            cloudyCard.classList.add('fade-out');
            resultsContainer.prepend(cloudyCard);
    
            setTimeout(() => {
                cloudyCard.classList.remove('fade-out');
            }, 20);
        }
    }

}
