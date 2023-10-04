import React, { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import styled from "styled-components";
import { getAllPoints } from "../../API";
import { Location } from "../../types";
import Album from "../Album/Album";


const Map = () => {
  const center = useMemo(() => ({ lat: 33.59, lng: 130.401 }), []); // 고정 위치(Fukuoka)

  const [locations, setLocations] = useState<Location[]>([]); // API로 받아온 위치 정보

  const [currentArea, setCurrentArea] = useState<string | null>(null); // 현재 선택된 마커의 지역(area) 정보 저장

  // API로부터 위치 정보를 받아옴
  useEffect(() => {
    (async () => {
      const locs = await getAllPoints();
      setLocations(locs);
    })();
  }, []);

  // Marker가 로드될 때 호출되는 함수
  const onLoad = (marker: any) => {
    console.log("marker: ", marker);
  };

  return (
    <Wrapper>
      <LoadScript
        googleMapsApiKey={`${process.env.REACT_APP_PUBLIC_GOOGLE_API_KEY}`}
      >
        <GoogleMap
          zoom={9}
          center={center}
          options={{ disableDefaultUI: true, styles: Styles }}
          mapContainerClassName="map-container"
        >
          {locations.map((location) => (
            <MarkerF
              key={location.id}
              onLoad={onLoad}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={(e) => {
                setCurrentArea(location.area); // 마커 클릭시 현재 선택된 지역을 설정
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      {currentArea && <Album area={currentArea} />}
      {/* 조건부 렌더링 추가 : area prop으로 현재 선택된 지역 이름 전달됨
          만일 선택된 내용이 없다면 기본값 : null 이 전달되는 것임*/}
    </Wrapper>
  );
};

// 지도 사이즈
const Wrapper = styled.div`
  .map-container {
    width: 80%;
    height: 500px;
    margin: auto;
  }
`;

// 지도 스타일 옵션
const Styles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export default Map;
