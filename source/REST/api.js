import { MAIN_URL, TOKEN } from "./config";


export const api = {
    async fetchTasks (page, size, search) {
        const response = await fetch(`${MAIN_URL}/?page=${page}&size=${size}&search=${search}`, {
            method:  "GET",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error('Tasks were not loaded');

        }
        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error("Task was not created");
        }

        const { data: task } = await response.json();

        return task;
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify([task]),
        });

        if (response.status !== 200) {
            throw new Error("Task was not updated");
        }

        const { data: updatedTask } = await response.json();

        return updatedTask;
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error("Task was not deleted");
        }
    },

    async completeAllTasks (tasks) {
        await Promise.all(tasks.map((task) => {
            return fetch(MAIN_URL, {
                method:  "PUT",
                headers: {
                    "Content-type": "application/json",
                    Authorization:  TOKEN,
                },
                body: JSON.stringify([{ ...task, completed: true }]),
            }).then((response) => {
                return response.json();
            }).then((data) => {
                return data;
            });
        })).then(() => {
            // console.log('values', values);
        }).catch(console.error.bind(console));
    },
};
