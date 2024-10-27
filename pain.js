let todoList = []; // Initialize an empty array to store to-do items
let selectedCategory = ''; // Initialize selectedCategory variable
//Used ChatGPT to write this
// Function to load to-do list from JSON file
function loadTodoList() {
    fetch('pain.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load to-do list');
            }
            return response.json(); // Read response as JSON
        })
        .then(data => {
            todoList = data; // Assign loaded data to todoList
            renderTodoList();
        })
        .catch(error => {
            console.error('Error loading to-do list:', error);
            // If loading fails, display an empty to-do list
            renderTodoList();
        });
}

// Load to-do list when the page loads
loadTodoList();

// Add item function
function addItem() {
    const title = document.getElementById('title').value;
    const dueDate = document.getElementById('dueDate').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const newItem = {
        title,
        dueDate,
        description,
        category,
        checkedOff: false
    };

    todoList.push(newItem);
    sortTodoListByDate();
    renderTodoList();
    saveTodoList(); // Save to-do list after adding a new item
}
function filter(){
    const todoListContainer = document.getElementById('todo-list');
    const categoryFilterSelect = document.getElementById('category-select'); // Change to select element
    const savedVal = categoryFilterSelect.value;
    todoListContainer.innerHTML = '';
    todoList
        .filter(item => !savedVal || item.category === savedVal || savedVal === '')
        .forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('todo-item');
            if (item.checkedOff) {
                itemElement.classList.add('checked-off');
            }

            itemElement.innerHTML = `
            <input type="checkbox" onchange="toggleCheck(${index})" ${item.checkedOff ? 'checked' : ''}>
            <strong>${item.title}</strong> - ${item.dueDate} (${item.category || 'Uncategorized'})
            <p>${item.description}</p>
            <button onclick="deleteItem(${index})">Delete</button>
            `;

            todoListContainer.appendChild(itemElement);
        });
    updateCheckedOffCount();
}
// Render to-do list function
// Render to-do list function
function renderTodoList() {
    const todoListContainer = document.getElementById('todo-list');
    const categoryFilterSelect = document.getElementById('category-select'); // Change to select element
    const savedVal = categoryFilterSelect.value;
    const savedString = categoryFilterSelect.textContent;
    todoListContainer.innerHTML = '';
    categoryFilterSelect.innerHTML = ''; // Clear previous options

    // Extract unique categories from todoList
    const categories = [...new Set(todoList.map(item => item.category))];

    // Add default option for all categories
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Categories';
    categoryFilterSelect.appendChild(defaultOption);

    // Add options for each category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category || 'Uncategorized';
        categoryFilterSelect.appendChild(option);
    });
    /*const categoryFilter = categoryFilterSelect.value;
    //categoryFilterSelect.textContent = savedString;
    todoList
        .filter(item => !savedVal || item.category === savedVal || savedVal === '')
        .forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('todo-item');
            if (item.checkedOff) {
                itemElement.classList.add('checked-off');
            }

            itemElement.innerHTML = `
            <input type="checkbox" onchange="toggleCheck(${index})" ${item.checkedOff ? 'checked' : ''}>
            <strong>${item.title}</strong> - ${item.dueDate} (${item.category || 'Uncategorized'})
            <p>${item.description}</p>
            <button onclick="deleteItem(${index})">Delete</button>
            `;

            todoListContainer.appendChild(itemElement);
        });*/
    filter();
    reset();
}

// Toggle check function
function toggleCheck(index) {
    todoList[index].checkedOff = !todoList[index].checkedOff;
    renderTodoList();
    saveTodoList(); // Save to-do list after toggling check
}

// Delete item function
function deleteItem(index) {
    todoList.splice(index, 1);
    renderTodoList();
    saveTodoList(); // Save to-do list after deleting an item
}

// Update checked off count function
function updateCheckedOffCount() {
    const checkedOffCount = todoList.filter(item => item.checkedOff).length;
    document.getElementById('checked-off-count').innerText = `Checked off: ${checkedOffCount}`;
}

// Sort to-do list by date function
function sortTodoListByDate() {
    todoList.sort((a, b) => {
        return new Date(a.dueDate) - new Date(b.dueDate);
    });
}

// Function to save to-do list to JSON file
// Function to save to-do list to JSON file
async function saveTodoList() {
    try {
        const jsonData = JSON.stringify(todoList, null, 2); // Convert the todoList array to JSON string

        // Create a blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a link element
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pain.json'; // Specify the file name

        // Simulate click on the link
        a.click();
    } catch (error) {
        console.error('Error saving to-do list:', error);
    }
}
function reset(){
    document.getElementById('title').value = ``;
    document.getElementById('description').value = ``;
    document.getElementById('category').value = ``;
    document.getElementById('dueDate').value = ``;
}
// Call populateCategoryFilter after loading the todoList
loadTodoList();

// Call populateCategoryFilter after loading the todoList
loadTodoList();
