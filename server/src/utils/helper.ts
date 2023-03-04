export const toVietnameseDatetime = (date: Date) => {
    // hh:mm:ss dd/mm/yyyy
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    return `${hour}:${minute}:${second} -  ${day}/${month}/${year}`;
};
export const toMoneyString = (money: number) => {
    const int = Math.floor(money);
    const decimal = Math.floor((money - int) * 100);
    return `${int.toLocaleString("vi-VN")},${decimal}đ`;
};

export const toTimeString = (time: number, withColon = true) => {
    // seconds
    // format: hh:mm
    const hour = ("0" + Math.floor(time / 3600)).slice(-3);
    const minute = ("0" + (Math.floor(time / 60) % 60)).slice(-2);

    return withColon ? `${hour}:${minute}` : `${hour} ${minute}`;
};
