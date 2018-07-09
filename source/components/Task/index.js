// Core
import React, { PureComponent } from 'react';
import cx from 'classnames';
import { string, bool, func } from 'prop-types';

// Instruments
import Styles from './styles.m.css';

// Components
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Remove from 'theme/assets/Remove';
import Edit from 'theme/assets/Edit';


export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
    };

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
        completed:     this.props.completed,
        favorite:      this.props.favorite,
        message:       this.props.message,
    };

    taskInput = React.createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });


    _setTaskEditingState = (state) => {
        const { isTaskEditing } = this.state;

        this.setState({ isTaskEditing: state }, () => {
            if (isTaskEditing) {
                this.taskInput.current.focus();
            }
        });
    };

    _updateNewTaskMessage = (e) => {
        const { value: message } = e.target;

        this.setState({
            newMessage: message,
        });
    };

    _updateTaskMessageOnClick = () => {
        const { newMessage, isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask({ message: newMessage });

            return null;
        }
        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnKeyDown = (e) => {
        const { newMessage } = this.state;

        if (newMessage === '') {
            return null;
        }

        if (e.key === 'Enter') {
            console.log('ENTER');
            e.preventDefault();
            this._updateTask({ message: newMessage });
        } else if (e.key === 'Escape') {
            console.log('ESCAPE');
            e.preventDefault();
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync } = this.props;
        const { completed } = this.state;

        this.setState({ completed: !completed }, () => {
            const updatedTask = this._getTaskShape({ completed: !this.props.completed });

            _updateTaskAsync(updatedTask);
        });
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync } = this.props;
        const { favorite } = this.state;

        this.setState({ favorite: !favorite }, () => {
            const updatedTask = this._getTaskShape({ favorite: !this.props.favorite });

            _updateTaskAsync(updatedTask);
        });
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _updateTask = (value) => {
        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }

        const updatedTask = this._getTaskShape(value);

        _updateTaskAsync(updatedTask);
        this._setTaskEditingState(false);

    };


    render () {
        const { isTaskEditing } = this.state;
        const { completed, favorite } = this.state;

        const taskClasses = cx(Styles.task, {
            [Styles.completed]: completed,
        });

        return (
            <li className = { taskClasses }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { this.state.newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions } >
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
