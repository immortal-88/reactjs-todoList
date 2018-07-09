// Core
import React, { Component } from 'react';
import Move from 'react-flip-move';


// Instruments
import Styles from './styles.m.css';
import { api } from "REST/api";


// Components
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';
import Spinner from 'components/Spinner/';
import { sortTasksByGroup } from "../../instruments/helpers";


export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (e) => {
        const { value: searchItem } = e.target;

        this.setState({ tasksFilter: searchItem.toLowerCase() });
    };


    _updateNewTaskMessage = (e) => {
        const { value: message } = e.target;

        this.setState({
            newTaskMessage: message,
        });
    };

    _getAllCompleted = () => {
        // const { tasks } = this.state;

        return this.state.tasks.every((task) =>
            task.completed
        );
    };

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks(1, 10, '');

            console.log('TASKS', tasks);

            this.setState({
                tasks,
            });
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (e) => {
        try {
            e.preventDefault();
            const { newTaskMessage } = this.state;

            this._setTasksFetchingState(true);

            if (!newTaskMessage) {
                return null;
            }

            const task = await api.createTask(newTaskMessage);

            this.setState((prevState) => ({
                task:           [task, ...prevState.tasks],
                newTaskMessage: '',
            }));

            this._fetchTasksAsync();
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);

            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (task) => {
        try {
            this._setTasksFetchingState(true);
            const updatedTask = await api.updateTask(task);

            this.setState((prevState) => ({
                task: [updatedTask, ...prevState.tasks],
            }));
        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        try {
            // if (this._getAllCompleted()) {
            //     return null;
            // }

            console.log(this._getAllCompleted());

            this._setTasksFetchingState(true);

            await api.completeAllTasks(this.state.tasks);

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(
                    tasks.map((task) => ({ ...task, completed: true })),
                ),
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const { tasks: userTasks, isTasksFetching, newTaskMessage, tasksFilter } = this.state;

        const completeAll = this._getAllCompleted();
        const todoList = userTasks
            .filter((task) => task.message.toLowerCase().includes(tasksFilter))
            .map((props) => (
                <Task
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                    key = { props.id }
                    { ...props }
                />
            ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1 className = { Styles.test }>{ 'Планировщик задач'}
                        </h1>
                        <input
                            placeholder = { 'Поиск' }
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync } >
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <Move duration = { 400 }>
                                    { todoList }
                                </Move>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { completeAll }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks } >Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
