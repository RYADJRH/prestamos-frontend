const isActiveDark = () => {
    return document.querySelector('html')!.classList.contains('dark');
}


export {
    isActiveDark
}