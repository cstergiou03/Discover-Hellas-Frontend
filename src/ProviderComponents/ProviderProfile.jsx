import React, { useState } from 'react';
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
    Breadcrumbs,
    Link,
    Input
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function ProviderProfile() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('(097) 234-5678');
    const [mobile, setMobile] = useState('(098) 765-4321');
    const [address, setAddress] = useState('Περιοχή Bay, Σαν Φρανσίσκο, Καλιφόρνια');
    const [verified, setVerified] = useState(false);

    const handleFullnameChange = (event) => setFullname(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePhoneChange = (event) => setPhone(event.target.value);
    const handleMobileChange = (event) => setMobile(event.target.value);
    const handleAddressChange = (event) => setAddress(event.target.value);

    const handleUpdate = () => {
        alert('Τα στοιχεία σας ενημερώθηκαν επιτυχώς!');
    };

    const data = (approved, pending, rejected) => ({
        labels: ['ΕΓΚΡΙΘΗΚΑΝ', 'ΣΕ ΑΝΑΜΟΝΗ', 'ΑΠΟΡΡΙΦΘΗΚΑΝ'],
        datasets: [
            {
                data: [approved, pending, rejected],
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
                                    image="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        margin: '0 auto 20px',
                                    }}
                                />
                                <Typography variant="h5" gutterBottom>
                                    {fullname}
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
                                        <Pie data={data(50, 30, 20)} />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Εκδηλώσεις (Events)
                                        </Typography>
                                        <Pie data={data(60, 25, 15)} />
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

export default ProviderProfile;