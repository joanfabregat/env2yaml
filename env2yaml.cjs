const fs = require('fs');
const readline = require('readline');

// Command-line argument handling
const [,, inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
    console.error("Usage: node script.js input.env output.yaml");
    process.exit(1);
}

// Check input file existence
if (!fs.existsSync(inputFile)) {
    console.error(`Input file does not exist: ${inputFile}`);
    process.exit(1);
}

// Function to process a line from the .env file
function processEnvLine(line) {
    if (line.startsWith('#') || line.trim() === '') {
        return line; // Comment or empty line
    }

    const [key, value] = line.split('=');
    if (!key) {
        console.error(`Invalid .env syntax in line: ${line}`)
        process.exit(1);
    }

    // YAML value formatting
    let yamlValue;
    if (value === '') {
        yamlValue = "''";
    } else if (!isNaN(value)) { // Check if it's a number
        yamlValue = value;
    } else if (value.startsWith('"') && value.endsWith('"') ||
        value.startsWith("'") && value.endsWith("'")
    ) {
        yamlValue = value; // Already has quotes
    } else {
        yamlValue = `'${value}'`; // Add quotes for strings
    }

    return `${key}: ${yamlValue}`;
}

// Main conversion logic
const rl = readline.createInterface({ input: fs.createReadStream(inputFile) });
let outputData = '';

rl.on('line', (line) => {
    outputData += processEnvLine(line) + '\n';
});

rl.on('close', () => {
    fs.writeFileSync(outputFile, outputData);
    console.log('Conversion complete!');
});