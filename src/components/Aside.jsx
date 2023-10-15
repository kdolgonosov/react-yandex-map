import { useEffect } from 'react';
import { useState } from 'react';
import './aside.css';

const Aside = ({ type, place, makeRoute }) => {
    console.log(type);
    return (
        <div className='card'>
            <div className='card__type'>{type === 'atm' ? 'Банкомат' : 'Отделение банка'}</div>

            <div className='card__location'>
                <div className='card__address'>{place.address}</div>
                {/* <div className='card__distance'>1,2 км от вас</div> */}
            </div>

            <div className='card__hours'>
                <div className='card__opening-hours'>Открыто до 20:00</div>
                {/* <div className='card__time-left'>Осталось 20 минут до закрытия</div> */}
            </div>

            <div className='card__availability'>Сейчас низкая загруженность</div>

            {type === 'office' && (
                <span className='card__phone'>
                    <span className='card__tel'>8 (800) 100-24-24</span>
                </span>
            )}

            <div className='card__divider'></div>

            <div className='card__services'>
                Услуги в {type === 'atm' ? 'банкомате' : 'отделении'}
            </div>
            <div className='card__services-items'>
                {type === 'atm' &&
                    Object.keys(place.services).map((key, index) => {
                        if (place.services[key].serviceCapability === 'SUPPORTED') {
                            return (
                                <div
                                    className={
                                        place.services[key].serviceActivity === 'AVAILABLE'
                                            ? 'card__services-item active'
                                            : 'card__services-item'
                                    }
                                    key={index}
                                >
                                    {key}
                                </div>
                            );
                        }
                    })}
            </div>

            <div className='card__divider'></div>

            {/* <div className='card__accessibility'>
                <div className='card__accessibility-left'>
                    <div className='card__accessibility-item'>Подходит маломобильным</div>
                </div>

                <div className='card__accessibility-right'>
                    <div className='card__accessibility-item'>Кнопка вызова персонала</div>
                    <div className='card__accessibility-item'>Пандус</div>
                </div>
            </div> */}
            {/* <div className='card__btns-wrapper'> */}
            <button className='card__button' onClick={() => makeRoute(true)}>
                Построить маршрут
            </button>
            {/* <button className='card__button' onClick={() => makeRoute(true)}>
                    Построить пешеходный маршрут
                </button> */}
            {/* </div> */}
        </div>
    );
};
export default Aside;
