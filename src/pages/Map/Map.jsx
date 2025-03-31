// Map.tsx
import React, {useState, useEffect} from "react";
import "./Map.css"
import locations from "../../data/location.json";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export default function MapComponent() {
  const [filters, setFilters] = useState({
    mcdelivery: false,
    "24hours": false,
    drivethru: false,
    clickandserve: false,
    rewards: false,
    evcharging: false,
  });

  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [currentPosition, setCurrentPosition] = useState([24.9683333, 121.1908333]); // Default center position
  const [inputPosition, setInputPosition] = useState({ lat: "", lon: "" });
  const [nearestLocations, setNearestLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // For "See More" details

   // Get user's current location
   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition([latitude, longitude]);
          console.log("Current position:", latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedFilters = { ...filters, [name]: checked };
    setFilters(updatedFilters);

    // Filter locations based on selected checkboxes
    const filtered = locations.filter((location) => {
      return (
        (!updatedFilters.mcdelivery || location.tags.McDelivery === "yes") &&
        (!updatedFilters["24hours"] || location.tags["open_24/7"] === "yes") &&
        (!updatedFilters.drivethru || location.tags.drive_thru === "yes") &&
        (!updatedFilters.clickandserve || location.tags.click_ans_serve === "yes") &&
        (!updatedFilters.rewards || location.tags.rewards === "yes") &&
        (!updatedFilters.evcharging || location.tags.eletric_vehicle_charging === "yes")
      );
    });

    setFilteredLocations(filtered);
  };

  // Handle input change for latitude and longitude
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputPosition((prev) => ({ ...prev, [name]: value }));
  };

  // Find nearest locations
  const findNearestLocations = () => {
    const { lat, lon } = inputPosition;
    if (!lat || !lon) {
      alert("請輸入有效的經緯度！");
      return;
    }

    const distances = locations.map((location) => {
      const distance = calculateDistance(lat, lon, location.lat, location.lon);
      return { ...location, distance };
    });

    const sortedLocations = distances.sort((a, b) => a.distance - b.distance).slice(0, 5);
    setNearestLocations(sortedLocations);
  };

  return (
    <div className="map-page">
    {/* Filter Input */}
    <div className="filter-container">
<label>
          <input
            type="checkbox"
            name="mcdelivery"
            checked={filters.mcdelivery}
            onChange={handleCheckboxChange}
          />
          McDelivery
        </label>
        <label>
          <input
            type="checkbox"
            name="24hours"
            checked={filters["24hours"]}
            onChange={handleCheckboxChange}
          />
          24 Hours
        </label>
        <label>
          <input
            type="checkbox"
            name="drivethru"
            checked={filters.drivethru}
            onChange={handleCheckboxChange}
          />
          Drive-Thru
        </label>
        <label>
          <input
            type="checkbox"
            name="clickandserve"
            checked={filters.clickandserve}
            onChange={handleCheckboxChange}
          />
          Click-and-Serve
        </label>
        <label>
          <input
            type="checkbox"
            name="rewards"
            checked={filters.rewards}
            onChange={handleCheckboxChange}
          />
          Rewards
        </label>
        <label>
          <input
            type="checkbox"
            name="evcharging"
            checked={filters.evcharging}
            onChange={handleCheckboxChange}
          />
          EV Charging
        </label>
    </div>

    {/* Nearest Locations Section */}
    <div className="nearest-locations">
        <h3>查找最近的麥當勞</h3>
        <input
          type="number"
          name="lat"
          placeholder="輸入緯度"
          value={inputPosition.lat}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="lon"
          placeholder="輸入經度"
          value={inputPosition.lon}
          onChange={handleInputChange}
        />
        <button onClick={findNearestLocations}>查找</button>

        <ul>
        {nearestLocations.length === 0 ? (
            <p>尚未查找</p>
          ) : (
            nearestLocations.map((location) => (
              <li key={location.id}>
                {location.tags.name} - 距離: {location.distance.toFixed(2)} 公里
                <button
                  className="see-more-btn"
                  onClick={() => setSelectedLocation(location)}
                >
                  See More
                </button>
              </li>
            ))
          )}
        </ul>

        {selectedLocation && (
          <div className="location-details">
            <button className="close-btn" onClick={() => setSelectedLocation(null)}>
              ×
            </button>
            <h4>{selectedLocation.tags.name}</h4>
            <p>McDelivery: {selectedLocation.tags.McDelivery === "yes" ? "提供" : "不提供"}</p>
            <p>24小時營業: {selectedLocation.tags["open_24/7"] === "yes" ? "是" : "否"}</p>
            <p>得來速: {selectedLocation.tags.drive_thru === "yes" ? "有" : "無"}</p>
            <p>點餐服務: {selectedLocation.tags.click_ans_serve === "yes" ? "有" : "無"}</p>
            <p>獎勵計畫: {selectedLocation.tags.rewards === "yes" ? "有" : "無"}</p>
            <p>電動車充電: {selectedLocation.tags.eletric_vehicle_charging === "yes" ? "有" : "無"}</p>
          </div>
        )}
      </div>

    <MapContainer center={currentPosition} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[24.9683333, 121.1908333]}>
        <Popup>You are here!</Popup>
      </Marker>

      {filteredLocations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lon]}>
                    <Popup>
            <strong>{location.tags.name}</strong>
            <br />
            McDelivery: {location.tags.McDelivery === "yes" ? "提供" : "不提供"}
            <br />
            24小時營業: {location.tags["open_24/7"] === "yes" ? "是" : "否"}
            <br />
            得來速: {location.tags.drive_thru === "yes" ? "有" : "無"}
            <br />
            點餐服務: {location.tags.click_ans_serve === "yes" ? "有" : "無"}
            <br />
            獎勵計畫: {location.tags.rewards === "yes" ? "有" : "無"}
            <br />
            電動車充電: {location.tags.eletric_vehicle_charging === "yes" ? "有" : "無"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>


    </div>
  );
}