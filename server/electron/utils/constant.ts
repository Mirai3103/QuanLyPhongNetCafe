import Employee from "../models/Employee";

let user: Employee | null = null;

export const getUser = () => user;
export const setUser = (employee: Employee) => {
    user = employee;
};
