// Annual glacier-wide balances for the actual field measurement intervals.
const ice = [
  {period:"2023/24",start:"20 Sep 2023",end:"19 Sep 2024",value:-1.399,year:2024},
  {period:"2024/25",start:"19 Sep 2024",end:"15 Sep 2025",value:-1.445,year:2025}
];
// FOEN station 2161. Long-term mean discharge by month, 1931–2025 (m³/s).
const flow = [0.386,0.328,0.50,1.7,8.5,29,45,45,25,7.6,1.5,0.63];
const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const sources = {
  station:"https://www.hydrodaten.admin.ch/en/seen-und-fluesse/stations/2161",
  river:"https://www.valais.ch/en/explore/activities/other-summer-activities/dams-tour/gibidum",
  power:"https://www.alpiq.com/energy/assets/hydropower/electra-massa-storage-power-plant"
};
