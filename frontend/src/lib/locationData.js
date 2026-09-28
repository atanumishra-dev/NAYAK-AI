export const locationData = {
  "Andhra Pradesh": {
    "Visakhapatnam": ["Bheemunipatnam", "Anandapuram", "Padmanabham"],
    "Guntur": ["Tenali", "Mangalagiri", "Tadikonda"]
  },
  "Maharashtra": {
    "Pune": ["Haveli", "Khed", "Ambegaon", "Junnar", "Shirur"],
    "Nagpur": ["Kamptee", "Hingna", "Katol", "Ramtek"]
  },
  "West Bengal": {
    "Darjeeling": ["Siliguri", "Kurseong", "Mirik"],
    "Jalpaiguri": ["Malbazar", "Maynaguri", "Dhupguri"]
  },
  "Uttar Pradesh": {
    "Lucknow": ["Bakshi Ka Talab", "Sarojininagar", "Mohanlalganj"],
    "Kanpur": ["Bilhaur", "Ghatampur", "Narwal"]
  },
  "Karnataka": {
    "Bengaluru Urban": ["Anekal", "Yelahanka", "Kengeri"],
    "Mysuru": ["Hunsur", "Nanjangud", "Periyapatna"]
  },
  "Gujarat": {
    "Ahmedabad": ["Sanand", "Daskroi", "Dholka"],
    "Surat": ["Bardoli", "Kamrej", "Olpad"]
  },
  "Tamil Nadu": {
    "Chennai": ["Ambattur", "Guindy", "Velachery"],
    "Coimbatore": ["Mettupalayam", "Pollachi", "Valparai"]
  },
  "Bihar": {
    "Patna": ["Danapur", "Maner", "Phulwari Sharif"],
    "Gaya": ["Bodh Gaya", "Manpur", "Tekari"]
  }
};

const statesList = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir"
];

// Fallback generator for generic data if the exact state isn't mapped
export const getStates = () => statesList;

export const getDistricts = (state) => {
  if (locationData[state]) {
    return Object.keys(locationData[state]);
  }
  return [`${state} District 1`, `${state} District 2`, `${state} District 3`];
};

export const getVillages = (state, district) => {
  if (locationData[state] && locationData[state][district]) {
    return locationData[state][district];
  }
  return [`${district} Village 1`, `${district} Village 2`, `${district} Village 3`];
};
