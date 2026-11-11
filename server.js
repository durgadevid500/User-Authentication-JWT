
require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET;

const usersFile = path.join(__dirname, "data", "users.json");

function getUsers() {
    if (!fs.existsSync(usersFile)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// REGISTER API
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const users = getUsers();
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = users.find(
            user => user.email === normalizedEmail
        );

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: Date.now().toString(),
            name,
            email: normalizedEmail,
            password: hashedPassword
        };

        users.push(user);
        saveUsers(users);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN API
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const users = getUsers();

        const user = users.find(
            u => u.email === String(email || "").trim().toLowerCase()
        );

        if (!user || !(await bcrypt.compare(password || "", user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// JWT AUTHENTICATION MIDDLEWARE
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token required"
        });
    }

    jwt.verify(token, SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;
        next();
    });
}

// PROTECTED PROFILE API
app.get("/api/auth/profile", authenticateToken, (req, res) => {
    const users = getUsers();

    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        id: user.id,
        email: user.email
    });
});

app.get("/", (req, res) => {
    res.json({ message: "User Authentication API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
