let Url ={
    server:"https://tiny-ruby-jackrabbit-belt.cyclic.app/"
}

const locations = [
    {
      city: "Kolkata",
      district: "Kolkata district",
      state: "West Bengal",
      country: "India",
      latitude: 22.5726,
      longitude: 88.3639,
      ipAddress: "http://localhost:5000",
    },
    {
      city: "Mumbai",
      district: "Mumbai district",
      state: "Maharashtra",
      country: "India",
      latitude: 19.0760,
      longitude: 72.8777,
      ipAddress: "192.168.0.2",
    },
    {
      city: "Delhi",
      district: "New Delhi",
      state: "Delhi",
      country: "India",
      latitude: 28.6139,
      longitude: 77.2090,
      ipAddress: "192.168.0.3",
    },
    {
      city: "Chennai",
      district: "Chennai district",
      state: "Tamil Nadu",
      country: "India",
      latitude: 13.0827,
      longitude: 80.2707,
      ipAddress: "192.168.0.4",
    },
    {
      city: "Bangalore",
      district: "Bangalore Urban",
      state: "Karnataka",
      country: "India",
      latitude: 12.9716,
      longitude: 77.5946,
      ipAddress: "192.168.0.5",
    },

  ];
  
  const locationDictionary = {};
  
  locations.forEach((location, index) => {
    const key = `location${index + 1}`;
    locationDictionary[key] = {
      server: "https://tiny-ruby-jackrabbit-belt.cyclic.app/",
      location: location,
    };
  });

  



export default Url;