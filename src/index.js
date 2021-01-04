// import { createStore } from "./createStore";
import { asyncIncrement, changeTheme, decrement, increment } from "./reduxCustom/actions";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reduxCustom/rootReducer";
import "./styles.css";
const counter = document.querySelector("#counter");
const add = document.querySelector("#add");
const sub = document.querySelector("#sub");
const async = document.querySelector("#async");
const theme = document.querySelector("#theme");

function pureJs() {
    let state = 0;
    render();
    add.addEventListener("click", () => {
        state++;
        render();
    });
    sub.addEventListener("click", () => {
        state--;
        render();
    });
    async.addEventListener("click", () => {
        setTimeout(() => {
            state++;
            render();
        }, 2000);
    });

    theme.addEventListener("click", () => {
        document.querySelector("body").classList.toggle("dark");
    });

    function render() {
        counter.textContent = state.toString();
    }
}

function customRedux() {
    function logger(state) {
        return function (next) {
            return function (action) {
                console.log(state.getState());
                const newState = next(action);
                console.log(state.getState());
                console.log(action);
                return newState;
            };
        };
    }
    const store = createStore(
        rootReducer,
        compose(
            applyMiddleware(thunk, logger),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    );
    window.store = store;
    add.addEventListener("click", () => {
        store.dispatch(increment());
    });
    sub.addEventListener("click", () => {
        store.dispatch(decrement());
    });
    async.addEventListener("click", () => {
        store.dispatch(asyncIncrement());
    });
    theme.addEventListener("click", () => {
        const newTheme = document.body.classList.contains("light") ? "dark" : "light";
        store.dispatch(changeTheme(newTheme));
    });

    store.subscribe(() => {
        const state = store.getState();
        counter.textContent = state.counter;
        document.body.className = state.theme.value;

        [add, sub, theme, async].forEach((btn) => (btn.disabled = state.theme.disabled));
    });

    store.dispatch({ type: "INIT_APPLICATION" });
}

customRedux();
