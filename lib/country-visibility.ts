export const excludedCountries = ["Australia", "Bosnia and Herzegovina", "Ireland", "Japan", "Lithuania", "Luxembourg", "Moldova", "New Zealand", "Portugal", "South Korea", "Switzerland", "Estonia"];
export const isVisibleCountry=(country:string)=>!excludedCountries.includes(country);
