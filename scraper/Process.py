from geopy.geocoders import Nominatim

def latlong(location): 
    geolocator = Nominatim(user_agent="minnehack")
    location = geolocator.geocode("China")
    return[location.latitude, location.longitude]

    