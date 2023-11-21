import {makeAutoObservable} from "mobx";
import { JSX } from 'react';

interface Modal{
    open: boolean,
    body: JSX.Element | null
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null
    }
    constructor() {
        makeAutoObservable(this)
    }
    
    /* открываем модальное окно */
    openModal = (content: JSX.Element) => {
        console.log(content)
        this.modal.open = true;
        this.modal.body = content;
    }

    /* закрываем модальное окно */
    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}