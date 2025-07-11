
    let isSigningUp = false;
    let isAddingTodo= false;
    document.getElementById('signup-form').addEventListener('submit', async(e)=>{
        e.preventDefault();
        if(isSigningUp)return;
        isSigningUp= true;
        const username = document.getElementById('signup-username').value;
        const password= document.getElementById('signup-password').value;
        try{
            const response = await fetch('http://localhost:5000/user/signup',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:  JSON.stringify({username, password}),
            });
            const result = await response.json();
            isSigningUp = false;

            if(response.ok){
                document.getElementById('response-message').innerText= result.message|| 'Signup is successful, please sign in';
                document.getElementById('signup-container').style.display='none';
                document.getElementById('signin-container').style.display = 'block';
                }else{
                        document.getElementById('response-message').innerText = result.message || 'Signup failed'; 
                }
        }catch(error){
            isSigningUp=false;
            document.getElementById('response-message').innerText= 'Error during signup'; 
        }
    });
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch('http://localhost:5000/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Get raw text and try to parse JSON safely
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('Server did not return JSON:', text);
            throw new Error('Server returned non-JSON. Check backend.');
        }

        if (response.ok) {
            localStorage.setItem('token', result.token);

            document.getElementById('signin-container').style.display = 'none';
            document.getElementById('todo-container').style.display = 'block';

            document.getElementById('response-message').innerHTML =
                `Logged in successfully. <a href="#" id="logout-link">Logout</a>`;

            loadTodos();

            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                document.getElementById('todo-container').style.display = 'none';
                document.getElementById('signin-container').style.display = 'block';
                document.getElementById('response-message').innerText = '';
            });
        } else {
            document.getElementById('response-message').innerText = result.message || 'Signin failed';
        }
    } catch (error) {
        document.getElementById('response-message').innerText = 'Error during signin';
        console.error('Signin error:', error);
    }
});


    document.getElementById('todo-form').addEventListener('submit',async(e)=>{
        e.preventDefault();
        if(isAddingTodo)return;
        isAddingTodo= true;

        const todoInput = document.getElementById('todo-input');
        const todoText = todoInput.value.trim();
        if(!todoText){
            isAddingTodo=false;
            return;
        }
        const token = localStorage.getItem('token');
        try{
            const response = await fetch('http://localhost:5000/todo/addtodo',
            {

                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body:  JSON.stringify({ title: todoText }),
            });
            const result = await response.json();
            isAddingTodo= false;
            if(response.ok){
                todoInput.value=' ';
                loadTodos();
            }
            else{
                console.error(result.msg);
            }

            }
            catch(error){
                isAddingTodo= false;
                console.error('Error adding todo:', error);

            }      
        }


    );

    async function loadTodos() {
    const token = localStorage.getItem('token');
    
    try {
      
        const response = await fetch('http://localhost:5000/todo/get', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const { todos } = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ''; 

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.title;

            if (todo.completed) {
                li.style.textDecoration = 'line-through';
            }

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.onclick = () => {
                completeTodo(todo._id, !todo.completed);
            };

            if (!todo.completed) {
                li.appendChild(completeButton);
            }

            todoList.appendChild(li);
        });

    } catch (error) {
        console.error('Error loading todos:', error);
    }
}



        async function completeTodo(id, completed) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`http://localhost:5000/todo/:id`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ completed }),
            });
            loadTodos();
        } catch (error) {
            console.error('Error completing todo:', error);
        }   
    }

    document.getElementById('show-signin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('signin-container').style.display = 'block';
    });

    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signin-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'block';
    });
