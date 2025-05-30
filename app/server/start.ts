

function run(app) {
    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Admin Auth API is running on http://localhost:${PORT}`);
    });
}

export default run;