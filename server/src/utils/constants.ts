export enum Role {
    Admin = "admin",
    Manager = "manager",
    Employee = "employee",
    User = "user",
}
export const permission = [Role.Admin, Role.Manager, Role.Employee, Role.User];
export const allRoleOsptions = [
    {
        label: "Admin",
        value: "admin",
    },
    {
        label: "Quản lý",
        value: "manager",
    },
    {
        label: "Nhân viên",
        value: "employee",
    },
    {
        label: "Người dùng",
        value: "user",
    },
];
