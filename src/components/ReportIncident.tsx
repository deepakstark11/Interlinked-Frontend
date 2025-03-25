import React, { useState, FormEvent } from "react";
import "../styles/IncidentReport.css";

const ReportIncident = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "0",
        location: "",
        latitude: "",
        longitude: "",
        altitude: "",
    });

    const [isTitleValid, setIsTitleValid] = useState(false);
    const [isLatitudeValid, setIsLatitudeValid] = useState(false);
    const [isLongitudeValid, setIsLongitudeValid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validations = {
            title: !formData.title,
            latitude: !formData.latitude,
            longitude: !formData.longitude,
        };

        const hasErrors = validations.title || validations.latitude || validations.longitude;

        setIsTitleValid(validations.title);
        setIsLatitudeValid(validations.latitude);
        setIsLongitudeValid(validations.longitude);

        if (!hasErrors) {
            console.log('Form Data:', formData);
            setFormData({
                title: "",
                description: "",
                category: "0",
                location: "",
                latitude: "",
                longitude: "",
                altitude: "",
            });
        }
    };

    return (
        <div className="home-container">
            <h1 className="centered-heading">Report Incident</h1>
            <div className="report-form">
                <form className="report-form-content" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            className="form-input"
                            value={formData.title}
                            onChange={handleChange}
                            style={{
                                border: isTitleValid ? "2px solid red" : "1px solid #ccc"
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            className="form-input"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Category<span style={{ color: 'red' }}>*</span></label>
                        <select 
                            className="form-mcq" 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="0">Wildfires</option>
                            <option value="1">Hurricanes</option>
                            <option value="2">Earthquakes</option>
                            <option value="3">Tornadoes</option>
                            <option value="4">Tsunamis</option>
                            <option value="5">Extreme Lightning/Thunderstorms</option>
                            <option value="6">Avalanches</option>
                            <option value="7">Landslides</option>
                            <option value="8">Droughts</option>
                            <option value="9">Volcanic Eruptions</option>
                            <option value="10">Oil Spills</option>
                            <option value="11">Flood (Long Term)</option>
                            <option value="12">Flash Floods (Short Term)</option>
                            <option value="13">Glacier Melting</option>
                            <option value="14">Ice Jams/Frozen Regions</option>
                            <option value="15">Air Quality & Pollution</option>
                            <option value="16">Chemical Spills/Radiation Leaks</option>
                            <option value="17">Geomagnetic Storms/Solar Flares</option>
                            <option value="18">Extreme Heat Events</option>
                            <option value="19">Extreme Cold Events</option>
                            <option value="20">Severe Weather Events</option>
                            <option value="21">Marine Events</option>
                            <option value="22">Long Term Events</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            className="form-input"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Latitude<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="latitude"
                            placeholder="Latitude"
                            className="form-input"
                            step="any"
                            value={formData.latitude}
                            onChange={handleChange}
                            style={{
                                border: isLatitudeValid ? "2px solid red" : "1px solid #ccc"
                            }}
                        />
                        <label>Longitude<span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="longitude"
                            placeholder="Longitude"
                            className="form-input"
                            step="any"
                            value={formData.longitude}
                            onChange={handleChange}
                            style={{
                                border: isLongitudeValid ? "2px solid red" : "1px solid #ccc"
                            }}
                        />
                        <label>Altitude</label>
                        <input
                            type="number"
                            name="altitude"
                            placeholder="Altitude (Optional)"
                            className="form-input"
                            step="any"
                            value={formData.altitude}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Report Incident
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportIncident;