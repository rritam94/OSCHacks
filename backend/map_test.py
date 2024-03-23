import googlemaps
from datetime import datetime

gmaps = googlemaps.Client(key='AIzaSyDPnSEsUJnIh6J8IdTLNC1MfnWrjBB8IzY')

now = datetime.now()
directions_result = gmaps.directions("Varsity House Gainesville",
                                     "Marston Science Library",
                                     mode="walking",
                                     departure_time=now)

print(directions_result)
