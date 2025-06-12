const ADD_BUTTON = document.querySelector('.add-button');
const TODO_LIST = document.querySelector('.todo-list');
const BASE_URL = 'http://localhost:8080';

/**
 * Todo表示処理
 */
async function fetchTodos() {
    const response = await fetch(`${BASE_URL}/todo/all`);
    if (!response.ok) {
        throw new Error('ネットワークエラー: ' + response.status);
    }
    const todos = await response.json();
    return todos;
}

function renderTodos(todos) {
    TODO_LIST.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = todo.content;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';

        /**
         * Todo削除処理
         */
        deleteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`${BASE_URL}/todo/delete/${todo.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('削除に失敗しました');
                }

                li.remove();
            } catch (error) {
                console.error('削除エラー:', error);
            }
        });

        li.appendChild(text);
        li.appendChild(deleteBtn);
        TODO_LIST.appendChild(li);
    });
}

async function display() {
    try {
        const todos = await fetchTodos();
        renderTodos(todos);
    } catch (error) {
        console.error('データ取得エラー:', error);
    }
}

display();

/**
 * Todo登録処理
 */
ADD_BUTTON.addEventListener('click', () => {
    const todoInput = document.querySelector('.input-todo');
    const todoText = todoInput.value;

    fetch(`${BASE_URL}/todo/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: todoText })
    })
        .then(response => {
            if (!response.ok) throw new Error('ネットワーク応答に問題あり');
            return response.json();
        })
        .then(data => {
            console.log('成功:', data);
            todoInput.value = '';
            display();
        })
        .catch(error => {
            console.error('エラー:', error);
        });
});