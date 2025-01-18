import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    TextField,
    Input
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { jwtDecode } from 'jwt-decode';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function AdminProfile() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [verified, setVerified] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");
    const [filteredAmenities, setAmenities] = useState([]);
    const [filteredEvents, setEvents] = useState([]);

    useEffect(() => {

        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                // Αποκωδικοποιούμε το JWT token
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                // Ρυθμίζουμε τα πεδία από το αποκωδικοποιημένο token
                const fullName = `${decodedToken.firstName} ${decodedToken.lastName}`; // Συνδυασμός firstName + lastName
                setFullname(fullName);
                setEmail(decodedToken.email);
                setProfilePicture(
                    decodedToken.photo || "https://via.placeholder.com/150"
                );
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const url1 = "https://olympus-riviera.onrender.com/api/admin/amenity/get/all?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url1)
        .then((response) => response.json())
        .then((data) => {
            setAmenities(data);
        })
        .catch((err) => {
            console.error('Error fetching amenities:', err.message);
        });

        const url2 = "https://olympus-riviera.onrender.com/api/admin/event/get/all?" + "Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`
        fetch(url2)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((err) => {
                console.error('Error fetching events:', err.message);
        });
    }, []);

    const handleFullnameChange = (event) => setFullname(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePhoneChange = (event) => setPhone(event.target.value);
    const handleMobileChange = (event) => setMobile(event.target.value);
    const handleAddressChange = (event) => setAddress(event.target.value);

    const handleUpdate = () => {
        alert('Τα στοιχεία σας ενημερώθηκαν επιτυχώς!');
    };

    const calculateStatusCounts = (items) => {
        const approved = items.filter((item) => item.status === 'APPROVED').length;
        const pending = items.filter((item) => item.status === 'PENDING').length;
        const rejected = items.filter((item) => item.status === 'REJECTED').length;
        return { approved, pending, rejected };
    };

    const amenitiesData = calculateStatusCounts(filteredAmenities);
    const eventsData = calculateStatusCounts(filteredEvents);

    const createChartData = (counts) => ({
        labels: ['ΕΓΚΡΙΘΗΚΑΝ', 'ΣΕ ΑΝΑΜΟΝΗ', 'ΑΠΟΡΡΙΦΘΗΚΑΝ'],
        datasets: [
            {
                data: [counts.approved, counts.pending, counts.rejected],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderColor: ['#28a745', '#ffc107', '#dc3545'],
                borderWidth: 1,
            },
        ],
    });

    return (
        <Box
            sx={{
                backgroundColor: '#f4f4f4',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 5,
            }}
        >
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CardMedia
                                    component="img"
                                    image={profilePicture}
                                    alt="avatar"
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        margin: '0 auto 20px',
                                    }}
                                />
                                <Typography variant="h5" gutterBottom>
                                    {fullname || 'Όνομα Χρήστη'}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>
                                    Ενημέρωση Στοιχείων
                                </Button>
                            </CardContent>
                        </Card>

                        <Card sx={{ mt: 4 }}>
                            <CardContent>
                                {verified ? (
                                    <Typography color="success.main" textAlign="center">
                                        Η ταυτοποίηση έχει ολοκληρωθεί
                                    </Typography>
                                ) : (
                                    <Box textAlign="center">
                                        <Typography gutterBottom>
                                            Παρακαλώ υποβάλετε τα απαιτούμενα έγγραφα:
                                        </Typography>
                                        <Input type="file" multiple sx={{ mb: 2 }} />
                                        <Button variant="contained" color="primary">
                                            Υποβολή Αρχείων
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Ονοματεπώνυμο"
                                            value={fullname}
                                            onChange={handleFullnameChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Τηλέφωνο"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Κινητό"
                                            value={mobile}
                                            onChange={handleMobileChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Διεύθυνση"
                                            value={address}
                                            onChange={handleAddressChange}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Παροχές (Amenity)
                                        </Typography>
                                        <Pie data={createChartData(amenitiesData)} />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Εκδηλώσεις (Events)
                                        </Typography>
                                        <Pie data={createChartData(eventsData)} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminProfile;
