const WHITE_LIST = [
    "localhost:4200",
    "flicks80s90s.onrender.com", // important : no "/" at the end of the URL
];

const corsOptions = {
    origin: (origin, callback) => {
        if (WHITE_LIST.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(console.error("Requête bloquée par CORS."));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
};

module.exports = corsOptions;
