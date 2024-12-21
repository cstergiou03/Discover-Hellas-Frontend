import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../Style/myCalendar.css";
import moment from 'moment';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function MyCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    // Λήψη των events από το API
    useEffect(() => {
        fetch("https://olympus-riviera.onrender.com/api/admin/event/get/all")
            .then((response) => response.json())
            .then((data) => {
                const approvedEvents = data
                    .filter(event => event.status === "APPROVED") // Φιλτράρουμε μόνο τα approved events
                    .map(event => ({
                        ...event,
                        start: new Date(event.event_start),
                        end: new Date(event.event_end),
                        title: event.name // Χρησιμοποιούμε το name ως title
                    }));
                setEvents(approvedEvents); // Αποθηκεύουμε τα φιλτραρισμένα δεδομένα
                setLoading(false); // Ενημερώνουμε ότι τελείωσε η φόρτωση
            })
            .catch((err) => {
                setError("Error fetching events: " + err.message);
                setLoading(false);
            });
    }, []); // Καλείται μόνο μία φορά κατά το πρώτο render

    const handleEventTravelClick = (eventId) => {
        console.log(`Navigating to event with ID: ${eventId}`);
        navigate(`/event/${eventId}`); // Πλοήγηση στο event με το συγκεκριμένο ID
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="calendar-container">
            <Header />
            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    titleAccessor="title" // Ορίζουμε το title ως τίτλο του event
                    defaultView="week"
                    style={{ height: 700, width: 1400 }}
                    views={['month', 'week', 'day']}
                    onSelectEvent={(event) => handleEventTravelClick(event.event_id)} // Πλοήγηση στο event με ένα κλικ
                />
            </div>
            <Footer />
        </div>
    );
}

export default MyCalendar;
