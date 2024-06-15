const LogInfo = (message) => {
    console.log(`Info: ${message}`);
}

const LogSuccess = (message) => {
    console.log(`Success: ${message}`);
}

const LogWarning = (message) => {
    console.log(`Warning: ${message}`);
}

const LogError = (message) => {
    console.log(`Error: ${message}`);
}

module.exports = { LogInfo, LogSuccess, LogWarning, LogError }