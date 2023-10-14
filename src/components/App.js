import './App.css';
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
import atms from '../data/atms.json';
import offices from '../data/offices.json';
import { useEffect, useRef, useState, useMemo } from 'react';

function App() {
    // const map = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [officesShowed, setOfficesShowed] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const defaultState = {
        center: [59.9386, 30.3141],
        zoom: 12,
    };

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
        console.log('Вы ограничили доступ к своим геоданным');
    }

    // const makeRoute = (ymaps) => {
    //     const pointa = [55.749, 37.524]; // москва
    //     const pointb = [59.918072, 30.304908]; // санкт-петербург

    //     const multiroute = new ymaps.multirouter.multiroute(
    //         {
    //             referencepoints: [pointa, pointb],
    //             params: {
    //                 routingmode: 'pedestrian',
    //             },
    //         },
    //         {
    //             boundsautoapply: true,
    //         },
    //     );

    //     map.current.geoobjects.add(multiroute);
    // };
    // const addRoute = () => {
    //     return withYMaps(makeRoute, true, 'multirouter.multiroute');
    // };

    // const RouteMaker = useMemo(() => {
    //     return ({ ymaps, route }) => {
    //         let canceled = false;

    //         if (ymaps && ymaps.route) {
    //             ymaps.route(route).then((route) => {
    //                 if (!canceled) {
    //                     console.log(route);
    //                 }
    //             });
    //         }
    //         return () => (canceled = true);
    //     };
    // }, []);
    // const Route = useMemo(() => {
    //     return withYMaps(RouteMaker, true, 'multirouter.multiroute');
    // }, [RouteMaker]);
    return (
        <YMaps query={{ load: 'package.full', apikey: '99cb827f-6ef6-4ba4-a062-6d104901f788' }}>
            {/* <Route route={['Moscow, Russia', 'Berlin, Germany']} /> */}
            <Map
                defaultState={defaultState}
                state={{ ...defaultState, center: userLocation }}
                width='100%'
                height='100vh'
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                // options={{
                //     restrictMapArea: [
                //         [75.63589, 19.558148],
                //         [40.335341, 184.902851],
                //     ],
                // }}
            >
                <Placemark geometry={userLocation} />

                <Clusterer
                    options={{
                        preset: 'islands#redClusterIcons',
                        groupByCoordinates: false,
                    }}
                >
                    {atms.atms.map((atm) => (
                        <Placemark
                            key={atm.address + Math.random()}
                            geometry={[atm.latitude, atm.longitude]}
                            properties={{
                                balloonContent: '<p>Здесь будет компонент банкомата</p>',
                            }}
                            options={{
                                preset: 'islands#redIcon',
                                // balloonContent: '<p>РАБОТАЕТ</p>',
                            }}
                            // onClick={addRoute()}
                        />
                    ))}
                </Clusterer>
                <Clusterer
                    options={{
                        preset: 'islands#darkGreenClusterIcons',
                        groupByCoordinates: false,
                    }}
                >
                    {offices.map((office) => (
                        <Placemark
                            key={office.salePointName}
                            geometry={[office.latitude, office.longitude]}
                            properties={{
                                balloonContent: '<p>Здесь будет компонент отделения</p>',
                            }}
                            options={{
                                preset: 'islands#darkOrangeIcon',
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
    );
}

export default App;
