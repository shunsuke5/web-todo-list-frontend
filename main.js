const TODO_LIST = document.querySelector('.todo-list');

// APIからTodoリストを取得する関数
async function fetchTodos() {
    const response = await fetch('http://localhost:8080/todo/all');
    if (!response.ok) {
        throw new Error('ネットワークエラー: ' + response.status);
    }
    const todos = await response.json();
    return todos;
}

// 取得したTodoリストを画面に表示する関数
function renderTodos(todos) {
    TODO_LIST.innerHTML = ''; // いったんリストをクリア
    todos.forEach(todo => {
        const li = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = todo.content;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            // ここに削除API呼び出しも書ける
        });

        li.appendChild(text);
        li.appendChild(deleteBtn);
        TODO_LIST.appendChild(li);
    });
}

// main関数で処理の流れを制御
async function main() {
    try {
        const todos = await fetchTodos();
        renderTodos(todos);
    } catch (error) {
        console.error('データ取得エラー:', error);
    }
}

// 実行
main();