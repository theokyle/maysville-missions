const fs = require('fs');
const path = require('path');

const apiUrl = process.env.NG_APP_API_URL;

if (!apiUrl) {
  throw new Error('Missing NG_APP_API_URL environment variable');
}

const outputDir = path.join(__dirname, '../src/environments');
fs.mkdirSync(outputDir, { recursive: true });

const content = `export const environment = {
  production: true,
  api_url: '${apiUrl}'
};
`;

fs.writeFileSync(path.join(outputDir, 'environment.ts'), content);

console.log('Generated Angular environment configuration.');
