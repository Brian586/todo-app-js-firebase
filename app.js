import { app, db, doc, setDoc, addDoc, getDocs, collection, updateDoc, deleteDoc } from "./firebase_config.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let todos = [];

const filters = {
    searchText: "",
    hideCompleted: false
}

$(".search-todo").on("input", () => {
    filters.searchText = $(".search-todo").val();
    createList(todos, filters);
});

// Define the renderTodos function
const renderTodos = async function () {
    // Access the "todos" collection and get the documents
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
        const todo = doc.data();
        todos.push(todo);
    });

    createList(todos, filters);
}

// For displaying todos in UI
const createList = function (todos, filters) {
    let count = 0;
    const filteredTodos = $.grep(todos, element => {
        return element.name.toLowerCase().includes(filters.searchText.toLowerCase());
    });

    $(".todos").empty();

    filteredTodos.forEach(element => {
        let divElement = $("<div class='form-check card singleTodo'>");
        let buttonElement = $("<button class='btn btn-danger float-right'>");
        let labelElement = $("<label class='form-check-label'>");
        let checkboxElement = $("<input type='checkbox' class='form-check-input'/>");
        let cardBodyElement = $('<div class="card-body">');

        buttonElement.text("Delete");
        buttonElement.on("click", () => {
            deleteTodo(element);
        })

        checkboxElement.attr("checked", element.isCompleted);
        checkboxElement.on("change", () => {
            toggleTodo(element);
        })
        labelElement.append(checkboxElement);
        labelElement.append("<span>" + element.name + "</span>");
        cardBodyElement.append(labelElement);
        cardBodyElement.append(buttonElement);
        divElement.append(cardBodyElement);

        $(".todos").append(divElement);
        if (element.isCompleted == false) {
            count++;
        }
    });

    $(".status").text(`You have ${count} uncompleted tasks.`);
}

const toggleTodo = async function (element) {
    const newTodo = {
        id: element.id,
        isCompleted: !element.isCompleted,
        name: element.name
    };

    try {
        // update in cloud firestore
        const docRef = doc(db, "todos", element.id);

        await updateDoc(docRef, newTodo);

        element.isCompleted = !element.isCompleted;

        createList(todos, filters);

        console.log("Todo Updated Successfully");

    } catch (e) {
        console.log(e);
    }

}

const deleteTodo = async function (element) {
    try {
        // Delete document from database using its ID
        await deleteDoc(doc(db, "todos", element.id));

        const todoIndex = todos.findIndex(todo => todo.id === element.id);

        if (todoIndex != -1) {
            todos.splice(todoIndex, 1);

            createList(todos, filters);
        }

        console.log("Document deleted successfully");
    } catch (e) {
        console.log(e);
    }

};

$(".submit-todo").click(async (e) => {
    e.preventDefault();
    const id = uuidv4();

    const todo = {
        name: $(".new-todo").val(),
        isCompleted: false,
        id: id,
    }

    try {
        const todoDoc = doc(db, `todos/${todo.id}`);

        await setDoc(todoDoc, todo);

        console.log(`Document added to Firestore`);

        todos.push(todo);
        $('.new-todo').val('');
        createList(todos, filters);

    } catch (e) {
        console.error(`Error adding document: ${e}`);
    }
});

$(".hidecompleted").change(() => {
    if ($(".hidecompleted").prop("checked")) {
        hideCompleted(todos, filters);
    } else {
        createList(todos, filters);
    }
});

const hideCompleted = function (todos, filters) {
    const filteredTodos = $.grep(todos, (element) => {
        if (element.isCompleted == filters.hideCompleted) {
            return element;
        }
    })

    createList(filteredTodos, filters);
}

renderTodos();