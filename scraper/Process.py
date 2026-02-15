from geopy.geocoders import Nominatim

def latlong(thelocation): 
    geolocator = Nominatim(user_agent="minnehack")
    location = geolocator.geocode(thelocation)
    if (location == None):
        return [None,None]
    if (location.latitude == 44.933143 and location.longitude ==7.540121): #When location is null it defaults to new york and i can't check for null in location
        return [None, None]
    return [location.latitude, location.longitude]

    