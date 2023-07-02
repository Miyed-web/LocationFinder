const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil;
const PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;
const OpenCageGeocoder = require('opencage-api-client').Geocoder;

// Initialize phone number util and geocoder
const phoneUtil = PhoneNumberUtil.getInstance();
const geocoder = new OpenCageGeocoder({ apiKey: '117ee67d8c5f4cef87506e6508494376' }); // Replace with your OpenCage API key

function getLocation(phoneNumber) {
  try {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, 'BD');
    if (phoneUtil.isValidNumber(parsedNumber)) {
      const nationalNumber = phoneUtil.format(parsedNumber, PhoneNumberFormat.NATIONAL);
      if (nationalNumber.length === 11) {
        const fullNumber = '+880' + nationalNumber;
        return geocoder.geocode({ q: fullNumber });
      }
    }
    return Promise.resolve(null);
  } catch (error) {
    return Promise.resolve(null);
  }
}

// Example usage
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Bangladeshi 11-character phone number (without country code): ', (phoneNumber) => {
  getLocation(phoneNumber)
    .then(response => {
      if (response && response.results.length > 0) {
        const location = response.results[0].geometry;
        console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
      } else {
        console.log('Invalid phone number or unable to retrieve location.');
      }
      rl.close();
    })
    .catch(error => {
      console.log('Error:', error.message);
      rl.close();
    });
});
