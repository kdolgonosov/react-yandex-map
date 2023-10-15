/* eslint-disable react-hooks/rules-of-hooks */
import './App.css';
import atmIcon from '../images/vtb-atm-icon.png';
import officeIcon from '../images/vtb-office-icon.png';
import Aside from './Aside';
import Filters from './Filters';
import Portal from './Portal';
import {
    YMaps,
    withYMaps,
    Map,
    Placemark,
    Polyline,
    Clusterer,
    ListBox,
    ListBoxItem,
} from '@pbe/react-yandex-maps';
import data from '../data/location.json';

// import atms from '../data/atms.json';
// import offices from '../data/offices.json';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useCallback } from 'react';

function App() {
    const map = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [officesShowed, setOfficesShowed] = useState(true);
    const [atms, setAtms] = useState([]);
    const [offices, setOffices] = useState([]);
    //
    const [activeAside, setActiveAside] = useState(false);
    const [activeFilters, setActiveFilters] = useState(true);
    const [activeRoute, setActiveRoute] = useState(false);
    const [prevRoute, setPrevRoute] = useState(null);
    const [selectedPlaceType, setSelectedPlaceType] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    //
    const defaultState = {
        center: [59.9386, 30.3141],
        zoom: 12,
    };
    useEffect(() => {
        fetch('https://hack.torbeno.ru/api/v1/typelist')
            .then((res) => res.json())
            .then((res) => {
                setAtms(res.atms);
                setOffices(res.offices);
            });
    }, []);
    // При монтировании определяет и сохраняет местоположение пользователя
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success, error);
    }, []);
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserLocation([latitude, longitude]);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    function error() {
        setUserLocation(null);
        console.log('Вы ограничили доступ к своим геоданным');
    }

    const routeBuilder = useCallback(({ ymaps, points }) => {
        // if (route) {
        //     map.current.geoObjects.remove(route);
        // }
        const route = [
            { type: 'viaPoint', point: points[0] },
            { type: 'wayPoint', point: points[1] },
        ];

        ymaps.route(route).then((route) => {
            // prevRoute && map.current.geoObjects.remove(prevRoute);
            console.log(route);
            if (prevRoute) {
                map.current.geoObjects.remove(prevRoute);
            }
            map.current.geoObjects.add(route);
            // setPrevRoute(route);
        });
        // .then((route) => setPrevRoute(route));
    });

    const NewRoute = useMemo(() => withYMaps(routeBuilder, true, ['route']), [routeBuilder]);

    const getOptimalPlaces = (radius, checkbox) => {
        let tags = [];
        if (checkbox === true) {
            tags.push('wheelchair', 'blind');
        }
        fetch('https://hack.torbeno.ru/api/v1/typelist', {
            method: 'POST',
            body: JSON.stringify({
                latitude: userLocation[0],
                longitude: userLocation[1],
                radius,
                tags,
            }),
        })
            .then((res) => res.json())
            .then((res) => console.log(res));
    };
    return (
        <div className='page'>
            <div className='header'>
                <a className='header__logo' href='#'></a>
            </div>
            <div className='content'>
                <div className='content__header'>
                    <button className='content__header_item content__header_item_type_active'>
                        Физическое лицо
                    </button>
                    <button className='content__header_item'>Юридическое лицо</button>
                </div>
                <div className='content__map-container'>
                    {activeAside && (
                        <Aside
                            type={selectedPlaceType}
                            makeRoute={setActiveRoute}
                            place={selectedPlace}
                        />
                    )}
                    {activeFilters && <Filters getOptimalPlaces={getOptimalPlaces} />}
                    <YMaps
                        query={{
                            // load: 'package.full',
                            apikey: '99cb827f-6ef6-4ba4-a062-6d104901f788',
                        }}
                    >
                        {activeRoute && (
                            <NewRoute
                                points={[
                                    userLocation,
                                    [selectedPlace.latitude, selectedPlace.longitude],
                                ]}
                            />
                        )}
                        <Map
                            defaultState={defaultState}
                            state={{ ...defaultState, center: userLocation }}
                            instanceRef={map}
                            className='content__map'
                            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                            // options={{
                            //     restrictMapArea: [
                            //         [75.63589, 19.558148],
                            //         [40.335341, 184.902851],
                            //     ],
                            // }}
                        >
                            {userLocation !== null && (
                                <Placemark
                                    geometry={userLocation}
                                    properties={{
                                        balloonContent:
                                            '<p class="balloon">Здесь будет компонент банкомата</p>',
                                    }}
                                />
                            )}
                            <Placemark geometry={[55.749, 37.524]} />
                            <Clusterer
                                options={{
                                    preset: 'islands#darkBlueClusterIcons',
                                    groupByCoordinates: false,
                                }}
                            >
                                {atms.map((atm) => (
                                    <Placemark
                                        key={atm.id}
                                        geometry={[atm.latitude, atm.longitude]}
                                        options={{
                                            iconLayout: 'default#image',
                                            iconImageHref: atmIcon,
                                            iconImageSize: [28, 28],
                                            // iconImageOffset: [-5, -38],
                                        }}
                                        onClick={() => {
                                            setSelectedPlaceType('atm');
                                            setSelectedPlace(atm);
                                            setActiveAside(true);
                                            setActiveRoute(false);
                                        }}
                                    />
                                ))}
                            </Clusterer>
                            <Clusterer
                                options={{
                                    preset: 'islands#blueClusterIcons',
                                    groupByCoordinates: false,
                                }}
                            >
                                {offices.map((office) => (
                                    <Placemark
                                        key={office.id}
                                        geometry={[office.latitude, office.longitude]}
                                        options={{
                                            iconLayout: 'default#image',
                                            iconImageHref: officeIcon,
                                            iconImageSize: [42, 42],
                                            // iconImageOffset: [-5, -38],
                                        }}
                                        onClick={() => {
                                            setSelectedPlaceType('office');
                                            setSelectedPlace(office);
                                            setActiveAside(true);
                                            setActiveRoute(false);
                                        }}
                                    />
                                ))}
                            </Clusterer>
                            {/* todo: отображение слоев */}
                            {/* <ListBox data={{ content: 'Select city' }}>
                    <ListBoxItem data={{ content: 'Moscow' }} />
                    <ListBoxItem data={officesShowed} state={officesShowed} />
                </ListBox> */}
                        </Map>
                    </YMaps>
                    {/* {activePortal && (
                        <Portal elementId={'driver-2'}>
                            <Aside />
                        </Portal>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default App;
