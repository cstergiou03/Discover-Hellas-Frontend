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
    Breadcrumbs,
    Link,
    Input
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { jwtDecode } from 'jwt-decode';
import Compressor from 'compressorjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function ProviderProfile() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [tin, setTin] = useState('');
    const [address, setAddress] = useState('');
    const [verified, setVerified] = useState(false);
    const [userId, setUserId] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [filteredAmenities, setAmenities] = useState([]);
    const [filteredEvents, setEvents] = useState([]);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {

                const decodedToken = jwtDecode(token);
                console.log(decodedToken);
                setFullname(decodedToken.firstName + " " + decodedToken.lastName);
                setEmail(decodedToken.email);
                setProfilePicture(decodedToken.photo);
                setUserId(decodedToken.userId);

                fetch(`https://olympus-riviera.onrender.com/api/user/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`

                )
                    .then((response) => response.json())
                    .then((data) => {
                        setPhone(data.phone);
                        setAddress(data.address);
                        setTin(data.tin);
                        setStatus(data.status);
                    })
                    .catch((err) => {
                        console.error('Error fetching profile data:', err.message);
                    });

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [userId])

    useEffect(() => {
        if (!userId) return;

        const amenityUrl = "https://olympus-riviera.onrender.com/api/provider/amenity/get/all/" + `${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        console.log(amenityUrl)
        fetch(amenityUrl)
            .then((response) => response.json())
            .then((data) => {
                setAmenities(data);
            })
            .catch((err) => {
                console.error('Error fetching amenities:', err.message);
            });

        const eventUrl = "https://olympus-riviera.onrender.com/api/provider/event/get/all/" + `${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem('userToken')}`;
        fetch(eventUrl)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((err) => {
                console.error('Error fetching events:', err.message);
            });
    }, [userId]);

    const handleFullnameChange = (event) => setFullname(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePhoneChange = (event) => setPhone(event.target.value);
    const handleAddressChange = (event) => setAddress(event.target.value);
    const handleTinChange = (event) => setTin(event.target.value);

    const handleUpdate = () => {
        const updatedData = {
            phone,
            address,
            tin, // Στέλνουμε το νέο πεδίο ΑΦΜ
        };

        fetch(`https://olympus-riviera.onrender.com/api/user/updateProfile/Provider/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Τα στοιχεία σας ενημερώθηκαν επιτυχώς!');
            })
            .catch((error) => {
                console.error("Error updating data:", error);
                alert("Παρουσιάστηκε σφάλμα κατά την ενημέρωση των στοιχείων.");
            });
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

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Λειτουργία μετατροπής ενός αρχείου σε Base64
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        const compressAndConvertFile = async (file) => {
            if (file.type.startsWith("image")) {
                return new Promise((resolve, reject) => {
                    new Compressor(file, {
                        quality: 0.6, // Ποιότητα εικόνας από 0 (χαμηλή ποιότητα) έως 1 (υψηλή ποιότητα)
                        maxWidth: 800, // Μέγιστο πλάτος
                        maxHeight: 800, // Μέγιστο ύψος
                        success(result) {
                            convertToBase64(result).then((base64) => {
                                resolve(base64);
                            }).catch((error) => reject(error));
                        },
                        error(err) {
                            reject(err);
                        }
                    });
                });
            } else if (file.type === "application/pdf") {
                return await convertToBase64(file);  // Όπως το κάνατε για τα PDF
            } else {
                console.warn(`Το αρχείο ${file.name} δεν είναι εικόνα ή PDF.`);
                return null;
            }
        };

        const base64Files = await Promise.all(
            selectedFiles.map(async (file) => {
                return await compressAndConvertFile(file);
            })
        );

        // Φιλτράρουμε τα null (μη έγκυρα αρχεία) και προσθέτουμε στο state
        setFiles((prevFiles) => [...prevFiles, ...base64Files.filter((file) => file !== null)]);
        console.log("Updated files array:", [...files, ...base64Files.filter((file) => file !== null)]);
    };

    const handleFileSubmit = () => {
        if (files.length > 0) {
            // Send PUT request to submit files (Base64 strings)
            const requestBody = {
                legal_document_id: files[0], // Assuming the first file is the legal document
                legal_document_tin: files[1], // Assuming the second file is the TIN
            };

            fetch(`https://olympus-riviera.onrender.com/api/user/updateProfile/Provider/${userId}` + "?Authorization=Bearer%20" + `${sessionStorage.getItem("userToken")}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    alert('Τα αρχεία υποβλήθηκαν επιτυχώς!');
                })
                .catch((error) => {
                    console.error("Error submitting files:", error);
                    alert("Παρουσιάστηκε σφάλμα κατά την υποβολή των αρχείων.");
                });
        } else {
            alert("Παρακαλώ επιλέξτε αρχεία.");
        }
    };

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
                                    sx={{ width: 150, height: 150, borderRadius: '50%', margin: '0 auto 20px' }}
                                />
                                <Typography variant="h5" gutterBottom>{fullname}</Typography>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>Ενημέρωση Στοιχείων</Button>
                            </CardContent>
                        </Card>

                        <Card sx={{ mt: 4, backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <CardContent>
                                {/* Αν το status είναι approved, εμφανίζουμε το μήνυμα αντί για τα αρχεία */}
                                {status === "APPROVED" && (
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="success.main">
                                            Έχετε εγκριθεί!
                                        </Typography>
                                    </Box>
                                )}
                                {status !== "APPROVED" && (
                                    <Box>
                                        <Card sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography gutterBottom>Άδεια Νομικού Εγγράφου:</Typography>
                                                <Input type="file" onChange={handleFileChange} fullWidth />
                                            </CardContent>
                                        </Card>

                                        <Card sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography gutterBottom>Άδεια ΑΦΜ:</Typography>
                                                <Input type="file" onChange={handleFileChange} fullWidth />
                                            </CardContent>
                                        </Card>

                                        <Box textAlign="center">
                                            <Button variant="contained" color="primary" onClick={handleFileSubmit}>Υποβολή Αρχείων</Button>
                                        </Box>
                                    </Box>
                                )}
                                {/* Αν το status είναι approved, εμφανίζουμε το μήνυμα */}
                                
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
                                            label="ΑΦΜ"
                                            value={tin} // Χρησιμοποιούμε το taxId για ΑΦΜ
                                            onChange={handleTinChange}
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

export default ProviderProfile;
