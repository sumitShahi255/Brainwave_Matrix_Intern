document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container');
    const currentDayEl = document.getElementById('currentDay');

    // Display the current date in the header
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDayEl.textContent = today.toLocaleDateString('en-US', options);

    const workHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9 AM to 5 PM in 24-hour format

    // --- 1. Generate Time Blocks ---
    workHours.forEach(hour => {
        // Create the main div for the time block row
        const timeBlock = document.createElement('div');
        timeBlock.id = `hour-${hour}`;
        timeBlock.classList.add('time-block', 'row');

        // Create the hour element
        const hourEl = document.createElement('div');
        hourEl.classList.add('hour');
        // Format hour for display (e.g., 13 -> 1 PM)
        const displayHour = hour > 12 ? `${hour - 12}PM` : (hour === 12 ? '12PM' : `${hour}AM`);
        hourEl.textContent = displayHour;

        // Create the textarea for user input
        const descriptionEl = document.createElement('textarea');
        descriptionEl.classList.add('description');

        // Create the save button
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('saveBtn');
        saveBtn.textContent = 'Save';

        // Append elements to the time block
        timeBlock.appendChild(hourEl);
        timeBlock.appendChild(descriptionEl);
        timeBlock.appendChild(saveBtn);

        // Append the completed time block to the container
        container.appendChild(timeBlock);
    });

    // --- 2. Update Time Block Colors ---
    function updateBlockColors() {
        const currentHour = new Date().getHours(); // Get current hour (0-23)

        document.querySelectorAll('.time-block').forEach(block => {
            const blockHour = parseInt(block.id.split('-')[1]);

            block.classList.remove('past', 'present', 'future');

            if (blockHour < currentHour) {
                block.classList.add('past');
            } else if (blockHour === currentHour) {
                block.classList.add('present');
            } else {
                block.classList.add('future');
            }
        });
    }

    // --- 3. Handle Saving and Loading Data ---
    function loadEvents() {
        document.querySelectorAll('.time-block').forEach(block => {
            const eventText = localStorage.getItem(block.id);
            if (eventText) {
                block.querySelector('.description').value = eventText;
            }
        });
    }

    // Event listener for all save buttons
    container.addEventListener('click', function (event) {
        if (event.target.classList.contains('saveBtn')) {
            const timeBlock = event.target.closest('.time-block');
            const eventText = timeBlock.querySelector('.description').value;
            const blockId = timeBlock.id;

            // Save to localStorage
            localStorage.setItem(blockId, eventText);

            // Optional: Add feedback to user
            alert(`Event for ${blockId.replace('-', ' ')} saved!`);
        }
    });

    // Initial setup when the page loads
    updateBlockColors();
    loadEvents();

    // Set an interval to update colors every minute to catch the hour change
    setInterval(updateBlockColors, 60000);
});