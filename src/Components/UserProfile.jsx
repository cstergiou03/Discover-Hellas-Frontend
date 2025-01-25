import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
}from "@mui/material";
import { styled } from "@mui/material/styles";
import { Delete, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

function UserProfile() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [plans, setPlans] = useState([]);
    const [newPlanTitle, setNewPlanTitle] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [preferences, setPreferences] = useState([]);
    const [selectedPrefrences, setSelectedPrefrencies] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [selectedHobbies, setSelectedHobbies] = useState([]);

    useEffect(() => {
        // Παίρνουμε το JWT token από το sessionStorage
        const token = sessionStorage.getItem("userToken");

        if (token) {
            try {
                // Αποκωδικοποιούμε το JWT token
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                // Ρυθμίζουμε τα πεδία από το αποκωδικοποιημένο token
                const fullName = `${decodedToken.firstName} ${decodedToken.lastName}`; // Συνδυασμός firstName + lastName
                setFullName(fullName);
                setEmail(decodedToken.email || "Άγνωστο email");
                setProfilePicture(
                    decodedToken.photo || "https://via.placeholder.com/150"
                );
                setUserId(decodedToken.userId);  // Βάζουμε το sub ως user_id
                console.log(userId);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        // Fetching user's plans
        if (userId) {
            fetch(`https://olympus-riviera.onrender.com/api/plan/user/${userId}/plans`)
                .then((response) => response.json())
                .then((data) => {
                    setPlans(data);
                })
                .catch((error) => console.error("Error fetching plans:", error));
        }

        fetch("https://olympus-riviera.onrender.com/api/destination/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                setPreferences(data); // Αποθηκεύουμε όλες τις κατηγορίες
            })
            .catch((error) => console.error("Error fetching categories:", error));

        fetch("https://olympus-riviera.onrender.com/api/activity/category/get/all")
            .then((response) => response.json())
            .then((data) => {
                setHobbies(data); // Αποθηκεύουμε όλες τις κατηγορίες
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, [userId]); // Βάζουμε το userId σαν εξάρτηση για να κάνουμε fetch τα πλάνα όταν το userId είναι έτοιμο
    
    useEffect(() => {
        if (userId) {
            fetch(`https://olympus-riviera.onrender.com/api/plan/user/${userId}/plans`)
                .then((response) => response.json())
                .then((data) => {
                    setPlans(data);
                })
                .catch((error) => console.error("Error fetching plans:", error));
        }
    }, [plans]); // Βάζουμε το userId σαν εξάρτηση για να κάνουμε fetch τα πλάνα όταν το userId είναι έτοιμο



    const handleFullNameChange = (event) => setFullName(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePhoneChange = (event) => setPhone(event.target.value);
    const handleMobileChange = (event) => setMobile(event.target.value);
    const handleAddressChange = (event) => setAddress(event.target.value);

    const handleUpdate = () => {
        alert("Τα στοιχεία σας ενημερώθηκαν επιτυχώς!");
    };

    const handleCreatePlan = () => {
        const newPlan = {
            title: newPlanTitle,
            plan: [],  // Στέλνεις το κενό array για το πεδίο plan
            user_id: userId, // Χρησιμοποιούμε το decodedToken.sub ως user_id
        };

        fetch("https://olympus-riviera.onrender.com/api/plan/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPlan),
        })
            .then((response) => response.json())
            .then((data) => {
                setPlans([...plans, data]);
                alert("Το νέο πλάνο δημιουργήθηκε με επιτυχία!");
            });
        setNewPlanTitle("");
    };

    const handleDeletePlan = (planId) => {
        fetch(`https://olympus-riviera.onrender.com/api/plan/${planId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    // Αν η διαγραφή ήταν επιτυχής, ανανεώνουμε τη λίστα πλάνων
                    fetch(`https://olympus-riviera.onrender.com/api/plan/user/${userId}/plans`)
                        .then((response) => response.json())
                        .then((data) => {
                            setPlans(data); // Ενημέρωση της λίστας με τα νέα δεδομένα
                        })
                        .catch((error) => console.error("Error fetching plans:", error));
                } else {
                    console.error("Error deleting plan:", response.statusText);
                }
            })
            .catch((error) => {
                console.error("Error deleting plan:", error);
            });
    };

    const handlePlanDetails = (planId) => {
        navigate(`/planView/${planId}`);
    };

    const handlePreferenceSelect = (categoryId) => {
        setSelectedPrefrencies((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Αφαίρεση αν υπάρχει ήδη
                : [...prev, categoryId] // Προσθήκη αν δεν υπάρχει
        );
    };

    const handleHobbieSelect = (categoryId) => {
        setSelectedHobbies((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId) // Αφαίρεση αν υπάρχει ήδη
                : [...prev, categoryId] // Προσθήκη αν δεν υπάρχει
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column", // For vertical stacking
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={3}>
                    {/* User Info Card */}
                    <Grid item xs={12} md={4}>
                        <StyledCard>
                            <CardContent sx={{ textAlign: "center" }}>
                                <Avatar
                                    alt="User Avatar"
                                    src={profilePicture} // Χρησιμοποιούμε την εικόνα από το JWT
                                    sx={{
                                        width: 150,
                                        height: 150,
                                        margin: "0 auto",
                                        mb: 2,
                                    }}
                                />
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    {fullName}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={handleUpdate}
                                    sx={{
                                        backgroundColor: "#a4c991",
                                        "&:hover": {
                                            backgroundColor: "#8fa97e",
                                        },
                                    }}
                                >
                                    Ενημέρωση Στοιχείων
                                </Button>
                            </CardContent>
                        </StyledCard>
                    </Grid>

                    {/* User Details Form */}
                    <Grid item xs={12} md={8}>
                        <StyledCard>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3 }}>
                                    Στοιχεία Χρήστη
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Ονοματεπώνυμο"
                                            value={fullName}
                                            onChange={handleFullNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Τηλέφωνο"
                                            value={phone}
                                            onChange={handlePhoneChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Κινητό"
                                            value={mobile}
                                            onChange={handleMobileChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Διεύθυνση"
                                            value={address}
                                            onChange={handleAddressChange}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                {/* Category Selection */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Προτιμήσεις
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {preferences.map((preference) => (
                                <Chip
                                    key={preference.category_id}
                                    label={preference.name}
                                    color={
                                        selectedPrefrences.includes(preference.category_id)
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => handlePreferenceSelect(preference.category_id)}
                                    clickable
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            <Container maxWidth="md" sx={{ mt: 4 }}>
                {/* Category Selection */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Hobbies
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {hobbies.map((hobbie) => (
                                <Chip
                                    key={hobbie.category_id}
                                    label={hobbie.name}
                                    color={
                                        selectedHobbies.includes(hobbie.category_id)
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => handleHobbieSelect(hobbie.category_id)}
                                    clickable
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Travel Plans Section */}
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {/* New Plan Creation */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Νέο Πλάνο
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    fullWidth
                                    label="Όνομα Πλάνου"
                                    value={newPlanTitle}
                                    onChange={(e) => setNewPlanTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#a4c991",
                                        "&:hover": {
                                            backgroundColor: "#8fa97e",
                                        },
                                    }}
                                    onClick={handleCreatePlan}
                                >
                                    Δημιουργία
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Travel Plans */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Πλάνα Ταξιδιού
                        </Typography>
                        <List>
                            {plans.map((plan) => (
                                <ListItem key={plan.plan_id} sx={{ borderBottom: "1px solid #ccc" }}>
                                    <ListItemText primary={plan.title} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleDeletePlan(plan.plan_id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            color="primary"
                                            onClick={() => handlePlanDetails(plan.plan_id)}
                                            sx={{ color: '#a4c991' }}
                                        >
                                            <ArrowForward />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default UserProfile;
