import React from 'react';
import './Filters.css';
import { useState } from 'react';

const Filters = ({ getOptimalPlaces }) => {
    const [inputValue, setInputValue] = useState('');
    const [checkboxValue, setcheckboxValue] = useState(false);
    const [radius, setRadius] = useState(5);
    const handleChangeInput = (e) => {
        setInputValue(e.target.value);
    };
    const handleChangeCheckbox = (e) => {
        setcheckboxValue(e.target.value);
    };
    const handleChangeInputRadius = (e) => {
        setRadius(e.target.value);
    };
    return (
        <div className='filters'>
            <input
                type='text'
                className='filters__input'
                onChange={handleChangeInput}
                value={inputValue}
                placeholder='Найти отделение, банкомат или услугу'
            />
            <div className='filters__bottom'>
                <div className='filters__bottom_btns'>
                    <button className='filters__bottom_btns-item filters__bottom_btns-item_type_active'>
                        Отделения
                    </button>
                    <button className='filters__bottom_btns-item'>Банкоматы</button>
                </div>
                <form className='filters__bottom_form'>
                    <label className='filters__bottom_label'>
                        Для людей с ограниченными возможностями
                    </label>
                    <input
                        className='filters__bottom_checkbox'
                        type='checkbox'
                        value={checkboxValue}
                        onChange={handleChangeCheckbox}
                    />
                    <label className='filters__bottom_label'>Радиус поиска в км</label>
                    <input
                        type='number'
                        placeholder='Радиус поиска'
                        value={radius}
                        onChange={handleChangeInputRadius}
                    />
                    <button
                        className='filters__bottom_btns-item filters__bottom_btns-item_type_active'
                        onClick={(e) => {
                            e.preventDefault();
                            getOptimalPlaces(radius, checkboxValue);
                        }}
                    >
                        Показать
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Filters;
