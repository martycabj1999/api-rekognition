export default () => {
    const possible: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomNumber: string = '0';
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
};
